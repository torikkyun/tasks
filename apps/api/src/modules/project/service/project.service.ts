import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

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
