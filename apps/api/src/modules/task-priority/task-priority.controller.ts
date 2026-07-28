import { Controller, Get } from "@nestjs/common";
import { TaskPriorityService } from "./task-priority.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllTaskPriorityResponseDto } from "./dto/find-all-task-priority.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Task Priorities")
@Controller("task-priorities")
export class TaskPriorityController {
  constructor(private readonly taskPriorityService: TaskPriorityService) {}

  @ApiResponse({
    status: 200,
    description: "Task priorities retrieved successfully",
    type: FindAllTaskPriorityResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllTaskPriorityResponseDto> {
    return await this.taskPriorityService.findAll();
  }
}
