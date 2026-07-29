import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import {
  FindAllProjectsResponseDto,
  QueryProjectDto,
} from "./dto/query-project.dto";
import { FindOneProjectResponseDto } from "./dto/find-one-project.dto";
import { CreateProjectResponseDto } from "./dto/create-project.dto";
import { CreateProjectMemberResponseDto } from "./dto/create-project-member.dto";
import { UpdateProjectResponseDto } from "./dto/update-project.dto";
import { toDto } from "@/common/helpers/to-dto.helper";
import { Prisma } from "@/generated/prisma/client";
import { FindAllProjectMembersResponseDto } from "./dto/find-all-project-member.dto";
import { CreateProjectMemberDto } from "./dto/create-project-member.dto";
import {
  UpdateProjectMemberDto,
  UpdateProjectMemberResponseDto,
} from "./dto/update-project-member.dto";

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

  async findMembers(
    projectId: string,
  ): Promise<FindAllProjectMembersResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        member: { include: { department: true } },
        memberRole: true,
      },
      orderBy: { joinedAt: "asc" },
    });

    return toDto(FindAllProjectMembersResponseDto, { members });
  }

  async addMember(
    projectId: string,
    dto: CreateProjectMemberDto,
  ): Promise<CreateProjectMemberResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_memberId: {
          projectId,
          memberId: dto.memberId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException("Staff đã là thành viên của dự án");
    }

    const member = await this.prisma.staff.findUnique({
      where: { id: dto.memberId },
      select: { id: true },
    });

    if (!member) {
      throw new NotFoundException("Staff not found");
    }

    const memberRole = await this.prisma.memberRole.findUnique({
      where: { id: dto.memberRoleId },
      select: { id: true },
    });

    if (!memberRole) {
      throw new NotFoundException("MemberRole not found");
    }

    const projectMember = await this.prisma.projectMember.create({
      data: {
        joinedAt: new Date(dto.joinedAt),
        leftAt: dto.leftAt ? new Date(dto.leftAt) : null,
        member: { connect: { id: dto.memberId } },
        project: { connect: { id: projectId } },
        memberRole: { connect: { id: dto.memberRoleId } },
      },
      include: {
        member: { include: { department: true } },
        memberRole: true,
      },
    });

    return toDto(CreateProjectMemberResponseDto, { member: projectMember });
  }

  async updateMember(
    projectId: string,
    memberId: string,
    dto: UpdateProjectMemberDto,
  ): Promise<UpdateProjectMemberResponseDto> {
    const projectMember = await this.prisma.projectMember.findFirst({
      where: { id: memberId, projectId },
      include: { member: { include: { department: true } }, memberRole: true },
    });

    if (!projectMember) {
      throw new NotFoundException("ProjectMember not found");
    }

    const updateData: Prisma.ProjectMemberUpdateInput = {};

    if (dto.memberRoleId !== undefined) {
      updateData.memberRole = { connect: { id: dto.memberRoleId } };
    }

    if (dto.joinedAt !== undefined) {
      updateData.joinedAt = new Date(dto.joinedAt);
    }

    if (dto.leftAt !== undefined) {
      updateData.leftAt = dto.leftAt ? new Date(dto.leftAt) : null;
    }

    try {
      const updatedMember = await this.prisma.projectMember.update({
        where: { id: memberId },
        data: updateData,
        include: {
          member: { include: { department: true } },
          memberRole: true,
        },
      });

      return toDto(UpdateProjectMemberResponseDto, { member: updatedMember });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("MemberRole not found");
      }
      throw e;
    }
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
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      select: { startDate: true, endDate: true },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const updatedStartDate =
      dto.startDate !== undefined ? new Date(dto.startDate) : project.startDate;
    const updatedEndDate =
      dto.endDate !== undefined ? new Date(dto.endDate) : project.endDate;

    if (
      updatedStartDate &&
      updatedEndDate &&
      updatedEndDate <= updatedStartDate
    ) {
      throw new BadRequestException("endDate phải sau startDate");
    }

    const updateData: Prisma.ProjectUpdateInput = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    if (dto.startDate !== undefined) {
      updateData.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }

    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    if (dto.statusId !== undefined) {
      updateData.status = { connect: { id: dto.statusId } };
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
