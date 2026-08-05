import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { toDto } from "@/common/helpers/to-dto.helper";
import { FindAllProjectTasksResponseDto } from "../dto/task/find-all-task.dto";
import { FindOneProjectTaskResponseDto } from "../dto/task/find-one-task.dto";
import {
  CreateProjectTaskDto,
  CreateProjectTaskResponseDto,
} from "../dto/task/create-task.dto";
import {
  UpdateProjectTaskDto,
  UpdateProjectTaskResponseDto,
} from "../dto/task/update-task.dto";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  private buildDependencies(task: {
    predecessorDependencies: Array<{
      id: string;
      dependencyType: string;
      lagDays: number;
      predecessorTaskId: string;
      successorTaskId: string;
    }>;
    successorDependencies: Array<{
      id: string;
      dependencyType: string;
      lagDays: number;
      predecessorTaskId: string;
      successorTaskId: string;
    }>;
  }) {
    const dependencies = [
      ...task.predecessorDependencies,
      ...task.successorDependencies,
    ];
    const seen = new Set<string>();
    return dependencies.filter((dependency) => {
      if (seen.has(dependency.id)) return false;
      seen.add(dependency.id);
      return true;
    });
  }

  async findAll(
    projectId: string,
    query: {
      phaseId?: string;
      milestoneId?: string;
      assigneeId?: string;
      statusId?: string;
      priorityId?: string;
      parentTaskId?: string | null;
    },
  ): Promise<FindAllProjectTasksResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
        deletedAt: null,
        ...(query.phaseId ? { phaseId: query.phaseId } : {}),
        ...(query.milestoneId ? { milestoneId: query.milestoneId } : {}),
        ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
        ...(query.statusId ? { statusId: query.statusId } : {}),
        ...(query.priorityId ? { priorityId: query.priorityId } : {}),
        ...(query.parentTaskId === "null"
          ? { parentTaskId: null }
          : query.parentTaskId !== undefined
            ? { parentTaskId: query.parentTaskId }
            : {}),
      },
      include: {
        status: true,
        priority: true,
        assignee: true,
        phase: true,
        milestone: true,
        predecessorDependencies: true,
        successorDependencies: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return toDto(FindAllProjectTasksResponseDto, {
      tasks: tasks.map((task) => ({
        ...task,
        dependencies: this.buildDependencies(task),
      })),
    });
  }

  async findOne(
    projectId: string,
    taskId: string,
  ): Promise<FindOneProjectTaskResponseDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId, deletedAt: null },
      include: {
        status: true,
        priority: true,
        assignee: true,
        createdBy: true,
        phase: true,
        milestone: true,
        childTasks: {
          where: { deletedAt: null },
          include: { status: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        predecessorDependencies: true,
        successorDependencies: true,
      },
    });
    if (!task) throw new NotFoundException("Task not found");

    return toDto(FindOneProjectTaskResponseDto, {
      task: { ...task, dependencies: this.buildDependencies(task) },
    });
  }

  async create(
    projectId: string,
    dto: CreateProjectTaskDto,
    userId: string,
  ): Promise<CreateProjectTaskResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    if (new Date(dto.endDate) <= new Date(dto.startDate)) {
      throw new BadRequestException("endDate phải sau startDate");
    }

    const [status, priority] = await Promise.all([
      this.prisma.taskStatus.findFirst({
        where: { id: dto.statusId },
        select: { id: true },
      }),
      this.prisma.taskPriority.findFirst({
        where: { id: dto.priorityId },
        select: { id: true },
      }),
    ]);
    if (!status) throw new NotFoundException("Status not found");
    if (!priority) throw new NotFoundException("Priority not found");

    if (dto.assigneeId) {
      const assignee = await this.prisma.staff.findFirst({
        where: { id: dto.assigneeId, deletedAt: null },
        select: { id: true },
      });
      if (!assignee) throw new NotFoundException("Assignee not found");
    }

    if (dto.phaseId) {
      const phase = await this.prisma.phase.findFirst({
        where: { id: dto.phaseId, projectId },
        select: { id: true },
      });
      if (!phase) throw new NotFoundException("Phase not found");
    }

    if (dto.milestoneId) {
      const milestone = await this.prisma.milestone.findFirst({
        where: { id: dto.milestoneId, projectId },
        select: { id: true },
      });
      if (!milestone) throw new NotFoundException("Milestone not found");
    }

    if (dto.parentTaskId) {
      const parentTask = await this.prisma.task.findFirst({
        where: { id: dto.parentTaskId, projectId, deletedAt: null },
        select: { id: true },
      });
      if (!parentTask)
        throw new BadRequestException("parentTask phải thuộc cùng project");
    }

    const task = await this.prisma.task.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        plannedHours: dto.plannedHours ?? null,
        sortOrder: dto.sortOrder ?? 0,
        progressPercent: 0,
        createdBy: { connect: { id: userId } },
        project: { connect: { id: projectId } },
        status: { connect: { id: dto.statusId } },
        priority: { connect: { id: dto.priorityId } },
        assignee: dto.assigneeId
          ? { connect: { id: dto.assigneeId } }
          : undefined,
        parentTask: dto.parentTaskId
          ? { connect: { id: dto.parentTaskId } }
          : undefined,
        phase: dto.phaseId ? { connect: { id: dto.phaseId } } : undefined,
        milestone: dto.milestoneId
          ? { connect: { id: dto.milestoneId } }
          : undefined,
      },
      include: { status: true, priority: true, assignee: true },
    });

    return toDto(CreateProjectTaskResponseDto, { task });
  }

  async update(
    projectId: string,
    taskId: string,
    dto: UpdateProjectTaskDto,
    user: { id: string; role: { code: string } },
  ): Promise<UpdateProjectTaskResponseDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId, deletedAt: null },
      select: { assigneeId: true, startDate: true, endDate: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    if (
      user.role.code !== "ADMIN" &&
      user.role.code !== "MANAGER" &&
      task.assigneeId !== user.id
    ) {
      throw new ForbiddenException("Forbidden");
    }

    const nextStartDate =
      dto.startDate !== undefined ? new Date(dto.startDate) : task.startDate;
    const nextEndDate =
      dto.endDate !== undefined ? new Date(dto.endDate) : task.endDate;
    if (nextStartDate && nextEndDate && nextEndDate <= nextStartDate) {
      throw new BadRequestException("endDate phải sau startDate");
    }

    const updateData: Prisma.TaskUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.startDate !== undefined)
      updateData.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) updateData.endDate = new Date(dto.endDate);
    if (dto.plannedHours !== undefined)
      updateData.plannedHours = dto.plannedHours;
    if (dto.actualHours !== undefined) updateData.actualHours = dto.actualHours;
    if (dto.progressPercent !== undefined)
      updateData.progressPercent = dto.progressPercent;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
    if (dto.statusId !== undefined)
      updateData.status = { connect: { id: dto.statusId } };
    if (dto.priorityId !== undefined)
      updateData.priority = { connect: { id: dto.priorityId } };
    if (dto.assigneeId !== undefined)
      updateData.assignee = dto.assigneeId
        ? { connect: { id: dto.assigneeId } }
        : { disconnect: true };
    if (dto.parentTaskId !== undefined)
      updateData.parentTask = dto.parentTaskId
        ? { connect: { id: dto.parentTaskId } }
        : { disconnect: true };
    if (dto.phaseId !== undefined)
      updateData.phase = dto.phaseId
        ? { connect: { id: dto.phaseId } }
        : { disconnect: true };
    if (dto.milestoneId !== undefined)
      updateData.milestone = dto.milestoneId
        ? { connect: { id: dto.milestoneId } }
        : { disconnect: true };

    if (dto.parentTaskId) {
      const parentTask = await this.prisma.task.findFirst({
        where: { id: dto.parentTaskId, projectId, deletedAt: null },
        select: { id: true },
      });
      if (!parentTask)
        throw new BadRequestException("parentTask phải thuộc cùng project");
    }

    if (dto.assigneeId) {
      const assignee = await this.prisma.staff.findFirst({
        where: { id: dto.assigneeId, deletedAt: null },
        select: { id: true },
      });
      if (!assignee) throw new NotFoundException("Assignee not found");
    }

    if (dto.statusId) {
      const status = await this.prisma.taskStatus.findFirst({
        where: { id: dto.statusId },
        select: { id: true },
      });
      if (!status) throw new NotFoundException("Status not found");
    }

    if (dto.priorityId) {
      const priority = await this.prisma.taskPriority.findFirst({
        where: { id: dto.priorityId },
        select: { id: true },
      });
      if (!priority) throw new NotFoundException("Priority not found");
    }

    if (dto.phaseId !== undefined && dto.phaseId !== null) {
      const phase = await this.prisma.phase.findFirst({
        where: { id: dto.phaseId, projectId },
        select: { id: true },
      });
      if (!phase) throw new NotFoundException("Phase not found");
    }

    if (dto.milestoneId !== undefined && dto.milestoneId !== null) {
      const milestone = await this.prisma.milestone.findFirst({
        where: { id: dto.milestoneId, projectId },
        select: { id: true },
      });
      if (!milestone) throw new NotFoundException("Milestone not found");
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: { status: true, priority: true, assignee: true },
    });

    return toDto(UpdateProjectTaskResponseDto, { task: updatedTask });
  }

  async remove(
    projectId: string,
    taskId: string,
  ): Promise<{ message: string }> {
    const deleted = await this.prisma.task.updateMany({
      where: { id: taskId, projectId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (deleted.count === 0) throw new NotFoundException("Task not found");
    return { message: "Task deleted successfully" };
  }
}
