import { Controller, Get } from "@nestjs/common";
import { TaskStatusService } from "./task-status.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllTaskStatusResponseDto } from "./dto/find-all-task-status.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Task Statuses")
@Controller("task-statuses")
export class TaskStatusController {
  constructor(private readonly taskStatusService: TaskStatusService) {}

  @ApiResponse({
    status: 200,
    description: "Task statuses retrieved successfully",
    type: FindAllTaskStatusResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllTaskStatusResponseDto> {
    return await this.taskStatusService.findAll();
  }
}
