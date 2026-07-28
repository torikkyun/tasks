import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllTaskStatusResponseDto } from "./dto/find-all-task-status.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class TaskStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllTaskStatusResponseDto> {
    const taskStatuses = await this.prisma.taskStatus.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllTaskStatusResponseDto, { taskStatuses });
  }
}
