import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { toDto } from "@/common/helpers/to-dto.helper";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import {
  CreateProjectMilestoneDto,
  CreateProjectMilestoneResponseDto,
} from "../dto/milestone/create-milestone.dto";
import { FindAllProjectMilestonesResponseDto } from "../dto/milestone/find-all-project-milestones.dto";
import { FindOneProjectMilestoneResponseDto } from "../dto/milestone/find-one-project-milestone.dto";
import {
  UpdateProjectMilestoneDto,
  UpdateProjectMilestoneResponseDto,
} from "../dto/milestone/update-milestone.dto";

@Injectable()
export class ProjectMilestoneService {
  constructor(private readonly prisma: PrismaService) {}

  async findMilestones(
    projectId: string,
    phaseId?: string,
  ): Promise<FindAllProjectMilestonesResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const milestones = await this.prisma.milestone.findMany({
      where: { projectId, ...(phaseId ? { phaseId } : {}) },
      include: { status: true, phase: true },
      orderBy: { dueDate: "asc" },
    });
    return toDto(FindAllProjectMilestonesResponseDto, { milestones });
  }

  async findMilestone(
    projectId: string,
    milestoneId: string,
  ): Promise<FindOneProjectMilestoneResponseDto> {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, projectId },
      include: { status: true, phase: true },
    });
    if (!milestone) throw new NotFoundException("Milestone not found");
    return toDto(FindOneProjectMilestoneResponseDto, { milestone });
  }

  async createMilestone(
    projectId: string,
    dto: CreateProjectMilestoneDto,
  ): Promise<CreateProjectMilestoneResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    if (dto.phaseId) {
      const phase = await this.prisma.phase.findFirst({
        where: { id: dto.phaseId, projectId },
        select: { id: true },
      });
      if (!phase) throw new NotFoundException("Phase not found");
    }

    try {
      const milestone = await this.prisma.milestone.create({
        data: {
          name: dto.name,
          description: dto.description,
          dueDate: new Date(dto.dueDate),
          completedDate: dto.completedDate ? new Date(dto.completedDate) : null,
          project: { connect: { id: projectId } },
          phase: dto.phaseId ? { connect: { id: dto.phaseId } } : undefined,
          status: { connect: { id: dto.statusId } },
        },
        include: { status: true, phase: true },
      });

      return toDto(CreateProjectMilestoneResponseDto, { milestone });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("MilestoneStatus not found");
      }
      throw e;
    }
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    dto: UpdateProjectMilestoneDto,
  ): Promise<UpdateProjectMilestoneResponseDto> {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, projectId },
      select: { dueDate: true, completedDate: true },
    });
    if (!milestone) throw new NotFoundException("Milestone not found");

    if (dto.phaseId !== undefined && dto.phaseId !== null) {
      const phase = await this.prisma.phase.findFirst({
        where: { id: dto.phaseId, projectId },
        select: { id: true },
      });
      if (!phase) throw new NotFoundException("Phase not found");
    }

    const updateData: Prisma.MilestoneUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.dueDate !== undefined) updateData.dueDate = new Date(dto.dueDate);
    if (dto.completedDate !== undefined)
      updateData.completedDate = dto.completedDate
        ? new Date(dto.completedDate)
        : null;
    if (dto.phaseId !== undefined)
      updateData.phase = dto.phaseId
        ? { connect: { id: dto.phaseId } }
        : { disconnect: true };
    if (dto.statusId !== undefined)
      updateData.status = { connect: { id: dto.statusId } };

    try {
      const updatedMilestone = await this.prisma.milestone.update({
        where: { id: milestoneId },
        data: updateData,
        include: { status: true, phase: true },
      });
      return toDto(UpdateProjectMilestoneResponseDto, {
        milestone: updatedMilestone,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("MilestoneStatus not found");
      }
      throw e;
    }
  }

  async removeMilestone(
    projectId: string,
    milestoneId: string,
  ): Promise<{ message: string }> {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id: milestoneId, projectId },
      select: { id: true },
    });
    if (!milestone) throw new NotFoundException("Milestone not found");

    await this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { milestoneId },
        data: { milestoneId: null },
      }),
      this.prisma.milestone.delete({ where: { id: milestoneId } }),
    ]);

    return { message: "Milestone deleted successfully" };
  }
}
