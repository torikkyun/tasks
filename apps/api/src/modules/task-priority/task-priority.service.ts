import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllTaskPriorityResponseDto } from "./dto/find-all-task-priority.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class TaskPriorityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllTaskPriorityResponseDto> {
    const taskPriorities = await this.prisma.taskPriority.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllTaskPriorityResponseDto, { taskPriorities });
  }
}
