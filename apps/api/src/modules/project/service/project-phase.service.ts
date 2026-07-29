import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { toDto } from "@/common/helpers/to-dto.helper";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import {
  CreateProjectPhaseDto,
  CreateProjectPhaseResponseDto,
} from "../dto/phase/create-phase.dto";
import { FindAllProjectPhasesResponseDto } from "../dto/phase/find-all-project-phases.dto";
import { FindOneProjectPhaseResponseDto } from "../dto/phase/find-one-project-phase.dto";
import {
  UpdateProjectPhaseDto,
  UpdateProjectPhaseResponseDto,
} from "../dto/phase/update-phase.dto";

@Injectable()
export class ProjectPhaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findPhases(
    projectId: string,
  ): Promise<FindAllProjectPhasesResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const phases = await this.prisma.phase.findMany({
      where: { projectId },
      include: { status: true },
      orderBy: { sortOrder: "asc" },
    });
    return toDto(FindAllProjectPhasesResponseDto, { phases });
  }

  async findPhase(
    projectId: string,
    phaseId: string,
  ): Promise<FindOneProjectPhaseResponseDto> {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId, projectId },
      include: {
        status: true,
        milestones: { include: { status: true }, orderBy: { dueDate: "asc" } },
      },
    });
    if (!phase) throw new NotFoundException("Phase not found");

    return toDto(FindOneProjectPhaseResponseDto, {
      phase: {
        ...phase,
        milestones: phase.milestones.map((milestone) => ({
          id: milestone.id,
          name: milestone.name,
          dueDate: milestone.dueDate,
          status: { code: milestone.status.code },
        })),
      },
    });
  }

  async createPhase(
    projectId: string,
    dto: CreateProjectPhaseDto,
  ): Promise<CreateProjectPhaseResponseDto> {
    const {
      name,
      description,
      sortOrder = 0,
      startDate,
      endDate,
      statusId,
    } = dto;
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");
    if (startDate && endDate && new Date(endDate) <= new Date(startDate))
      throw new BadRequestException("endDate phải sau startDate");

    try {
      const phase = await this.prisma.phase.create({
        data: {
          name,
          description,
          sortOrder,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          project: { connect: { id: projectId } },
          status: { connect: { id: statusId } },
        },
        include: { status: true },
      });
      return toDto(CreateProjectPhaseResponseDto, { phase });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        throw new NotFoundException("PhaseStatus not found");
      throw e;
    }
  }

  async updatePhase(
    projectId: string,
    phaseId: string,
    dto: UpdateProjectPhaseDto,
  ): Promise<UpdateProjectPhaseResponseDto> {
    const { name, description, sortOrder, startDate, endDate, statusId } = dto;
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId, projectId },
      select: { startDate: true, endDate: true },
    });
    if (!phase) throw new NotFoundException("Phase not found");

    const updatedStartDate =
      startDate !== undefined
        ? startDate
          ? new Date(startDate)
          : null
        : phase.startDate;
    const updatedEndDate =
      endDate !== undefined
        ? endDate
          ? new Date(endDate)
          : null
        : phase.endDate;
    if (
      updatedStartDate &&
      updatedEndDate &&
      updatedEndDate <= updatedStartDate
    )
      throw new BadRequestException("endDate phải sau startDate");

    const updateData: Prisma.PhaseUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (startDate !== undefined)
      updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined)
      updateData.endDate = endDate ? new Date(endDate) : null;
    if (statusId !== undefined)
      updateData.status = { connect: { id: statusId } };

    try {
      const updatedPhase = await this.prisma.phase.update({
        where: { id: phaseId },
        data: updateData,
        include: { status: true },
      });
      return toDto(UpdateProjectPhaseResponseDto, { phase: updatedPhase });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        throw new NotFoundException("PhaseStatus not found");
      throw e;
    }
  }

  async removePhase(
    projectId: string,
    phaseId: string,
  ): Promise<{ message: string }> {
    const deleted = await this.prisma.phase.deleteMany({
      where: { id: phaseId, projectId },
    });
    if (deleted.count === 0) throw new NotFoundException("Phase not found");
    return { message: "Phase deleted successfully" };
  }
}
