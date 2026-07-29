import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { toDto } from "@/common/helpers/to-dto.helper";
import {
  CreateTaskDependencyDto,
  CreateTaskDependencyResponseDto,
} from "../dto/task-dependency/create-task-dependency.dto";
import { DeleteTaskDependencyResponseDto } from "../dto/task-dependency/delete-task-dependency.dto";

@Injectable()
export class TaskDependencyService {
  constructor(private readonly prisma: PrismaService) {}

  async createDependency(
    projectId: string,
    successorTaskId: string,
    dto: CreateTaskDependencyDto,
  ): Promise<CreateTaskDependencyResponseDto> {
    if (dto.predecessorTaskId === successorTaskId) {
      throw new BadRequestException(
        "Predecessor và successor là cùng một task",
      );
    }

    const [predecessorTask, successorTask] = await Promise.all([
      this.prisma.task.findFirst({
        where: { id: dto.predecessorTaskId, projectId, deletedAt: null },
        select: { id: true, projectId: true },
      }),
      this.prisma.task.findFirst({
        where: { id: successorTaskId, projectId, deletedAt: null },
        select: { id: true, projectId: true },
      }),
    ]);

    if (!predecessorTask)
      throw new NotFoundException("Predecessor task not found");
    if (!successorTask) throw new NotFoundException("Successor task not found");
    if (predecessorTask.projectId !== successorTask.projectId) {
      throw new BadRequestException("Hai task phải cùng project");
    }

    const existing = await this.prisma.taskDependency.findFirst({
      where: { predecessorTaskId: dto.predecessorTaskId, successorTaskId },
      select: { id: true },
    });
    if (existing)
      throw new ConflictException("Dependency đã tồn tại giữa hai task này");

    const dependency = await this.prisma.taskDependency.create({
      data: {
        predecessorTask: { connect: { id: dto.predecessorTaskId } },
        successorTask: { connect: { id: successorTaskId } },
        dependencyType: dto.dependencyType,
        lagDays: dto.lagDays ?? 0,
      },
    });

    return toDto(CreateTaskDependencyResponseDto, { dependency });
  }

  async removeDependency(id: string): Promise<DeleteTaskDependencyResponseDto> {
    const deleted = await this.prisma.taskDependency.deleteMany({
      where: { id },
    });
    if (deleted.count === 0)
      throw new NotFoundException("Dependency not found");
    return { message: "Dependency deleted successfully" };
  }
}
