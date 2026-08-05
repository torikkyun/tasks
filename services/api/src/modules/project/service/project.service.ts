import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { CreateProjectDto } from "../dto/project/create-project.dto";
import { UpdateProjectDto } from "../dto/project/update-project.dto";
import {
  FindAllProjectsResponseDto,
  QueryProjectDto,
} from "../dto/project/query-project.dto";
import { FindOneProjectResponseDto } from "../dto/project/find-one-project.dto";
import { CreateProjectResponseDto } from "../dto/project/create-project.dto";
import { UpdateProjectResponseDto } from "../dto/project/update-project.dto";
import { toDto } from "@/common/helpers/to-dto.helper";
import { Prisma } from "@/generated/prisma/client";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AttachmentDto } from "../../shared/dto/attachment.dto";
import { Express } from "express";
import { FindProjectGanttQueryDto } from "../dto/gantt/find-project-gantt-query.dto";
import { FindProjectGanttResponseDto } from "../dto/gantt/find-project-gantt.dto";

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private toAttachmentDto(attachment: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: bigint | null;
    mimeType: string | null;
    createdAt: Date;
    uploadedBy: { id: string; name: string } | null;
  }): AttachmentDto {
    return {
      id: attachment.id,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileSize:
        attachment.fileSize === null ? null : Number(attachment.fileSize),
      mimeType: attachment.mimeType,
      createdAt: attachment.createdAt,
      uploadedBy: attachment.uploadedBy!,
    };
  }

  async createAttachment(
    projectId: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<AttachmentDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const uploadPath = this.configService.get<string>("app.uploadPath");
    if (!uploadPath)
      throw new BadRequestException("Upload path not configured");

    const attachmentDir = join(uploadPath, "attachments");
    await mkdir(attachmentDir, { recursive: true });

    const safeName = `${randomUUID()}-${file.originalname}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
    await writeFile(join(attachmentDir, safeName), file.buffer);

    const attachment = await this.prisma.attachment.create({
      data: {
        fileName: file.originalname,
        fileUrl: `/uploads/attachments/${safeName}`,
        fileSize: BigInt(file.size),
        mimeType: file.mimetype,
        uploadedBy: { connect: { id: userId } },
        project: { connect: { id: projectId } },
      },
      include: { uploadedBy: true },
    });

    return this.toAttachmentDto(attachment);
  }

  async findAttachments(projectId: string): Promise<AttachmentDto[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const attachments = await this.prisma.attachment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: true },
    });
    return attachments.map((attachment) => this.toAttachmentDto(attachment));
  }

  async findGantt(
    projectId: string,
    query: FindProjectGanttQueryDto,
  ): Promise<FindProjectGanttResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      include: { status: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const [phases, milestones, tasks, dependencies] = await Promise.all([
      this.prisma.phase.findMany({
        where: { projectId, ...(query.phaseId ? { id: query.phaseId } : {}) },
        include: { status: true },
        orderBy: { sortOrder: "asc" },
      }),
      this.prisma.milestone.findMany({
        where: {
          projectId,
          ...(query.phaseId ? { phaseId: query.phaseId } : {}),
        },
        include: { status: true },
        orderBy: { dueDate: "asc" },
      }),
      this.prisma.task.findMany({
        where: {
          projectId,
          deletedAt: null,
          ...(query.phaseId ? { phaseId: query.phaseId } : {}),
          ...(query.startDate || query.endDate
            ? {
                AND: [
                  query.startDate
                    ? { endDate: { gte: new Date(query.startDate) } }
                    : {},
                  query.endDate
                    ? { startDate: { lte: new Date(query.endDate) } }
                    : {},
                ],
              }
            : {}),
        },
        include: {
          assignee: true,
          status: true,
          priority: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      this.prisma.taskDependency.findMany({
        where: {
          predecessorTask: { projectId, deletedAt: null },
          successorTask: { projectId, deletedAt: null },
        },
      }),
    ]);

    const taskIds = new Set(tasks.map((task) => task.id));
    const filteredDependencies = dependencies.filter(
      (dependency) =>
        taskIds.has(dependency.predecessorTaskId) &&
        taskIds.has(dependency.successorTaskId),
    );

    return {
      project: {
        id: project.id,
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        status: { code: project.status.code },
      },
      phases: phases.map((phase) => ({
        id: phase.id,
        name: phase.name,
        sortOrder: phase.sortOrder,
        startDate: phase.startDate,
        endDate: phase.endDate,
        status: { code: phase.status.code },
      })),
      milestones: milestones.map((milestone) => ({
        id: milestone.id,
        name: milestone.name,
        dueDate: milestone.dueDate,
        completedDate: milestone.completedDate,
        phaseId: milestone.phaseId,
        status: { code: milestone.status.code },
      })),
      tasks: tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        progressPercent: task.progressPercent,
        sortOrder: task.sortOrder,
        parentTaskId: task.parentTaskId,
        phaseId: task.phaseId,
        milestoneId: task.milestoneId,
        assignee: task.assignee
          ? {
              id: task.assignee.id,
              name: task.assignee.name,
              avatarUrl: task.assignee.avatarUrl,
            }
          : null,
        status: { id: task.status.id, code: task.status.code },
        priority: { id: task.priority.id, code: task.priority.code },
      })),
      dependencies: filteredDependencies.map((dependency) => ({
        id: dependency.id,
        predecessorTaskId: dependency.predecessorTaskId,
        successorTaskId: dependency.successorTaskId,
        dependencyType: dependency.dependencyType,
        lagDays: dependency.lagDays,
      })),
    };
  }

  async findAll(query: QueryProjectDto): Promise<FindAllProjectsResponseDto> {
    const { page = 1, limit = 10, search, statusId } = query;

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (statusId) {
      where.statusId = statusId;
    }

    const total = await this.prisma.project.count({ where });

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { status: true },
    });

    return toDto(FindAllProjectsResponseDto, {
      projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  }

  async findOne(id: string): Promise<FindOneProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        status: true,
        projectMembers: {
          include: {
            member: true,
            memberRole: true,
          },
          orderBy: { joinedAt: "asc" },
        },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const result = toDto(FindOneProjectResponseDto, {
      project: {
        ...project,
        members: project.projectMembers,
      },
    });

    return result;
  }

  async removeMember(
    projectId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const deleted = await this.prisma.projectMember.deleteMany({
      where: { id: memberId, projectId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException("ProjectMember not found");
    }

    return { message: "Member removed successfully" };
  }

  async create(dto: CreateProjectDto): Promise<CreateProjectResponseDto> {
    const { name, description, startDate, endDate, statusId } = dto;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestException("endDate phải sau startDate");
    }

    try {
      const project = await this.prisma.project.create({
        data: {
          name,
          description,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: { connect: { id: statusId } },
        },
        include: { status: true },
      });

      return toDto(CreateProjectResponseDto, { project });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("ProjectStatus not found");
      }
      throw e;
    }
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<UpdateProjectResponseDto> {
    const { name, description, startDate, endDate, statusId } = dto;
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      select: { startDate: true, endDate: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const updatedStartDate =
      startDate !== undefined ? new Date(startDate) : project.startDate;
    const updatedEndDate =
      endDate !== undefined ? new Date(endDate) : project.endDate;

    if (
      updatedStartDate &&
      updatedEndDate &&
      updatedEndDate <= updatedStartDate
    ) {
      throw new BadRequestException("endDate phải sau startDate");
    }

    const updateData: Prisma.ProjectUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (startDate !== undefined) {
      updateData.startDate = startDate ? new Date(startDate) : null;
    }

    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    if (statusId !== undefined) {
      updateData.status = { connect: { id: statusId } };
    }

    try {
      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: updateData,
        include: { status: true },
      });

      return toDto(UpdateProjectResponseDto, { data: updatedProject });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("ProjectStatus not found");
      }
      throw e;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.$transaction([
        this.prisma.attachment.deleteMany({ where: { projectId: id } }),
        this.prisma.task.deleteMany({ where: { projectId: id } }),
        this.prisma.milestone.deleteMany({ where: { projectId: id } }),
        this.prisma.phase.deleteMany({ where: { projectId: id } }),
        this.prisma.project.update({
          where: { id },
          data: { deletedAt: new Date() },
        }),
      ]);

      return { message: "Project deleted successfully" };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Project not found");
      }
      throw e;
    }
  }
}
