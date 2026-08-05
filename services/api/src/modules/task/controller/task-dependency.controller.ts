import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { TaskDependencyService } from "../service/task-dependency.service";
import {
  CreateTaskDependencyDto,
  CreateTaskDependencyResponseDto,
} from "../dto/task-dependency/create-task-dependency.dto";
import { DeleteTaskDependencyResponseDto } from "../dto/task-dependency/delete-task-dependency.dto";

@Controller()
@ApiTags("Task Dependencies")
@ApiBearerAuth()
export class TaskDependencyController {
  constructor(private readonly taskDependencyService: TaskDependencyService) {}

  @ApiResponse({
    status: 201,
    description: "Task dependency created successfully",
    type: CreateTaskDependencyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Predecessor và successor là cùng một task",
  })
  @ApiResponse({ status: 400, description: "Hai task phải cùng project" })
  @ApiResponse({
    status: 404,
    description: "Predecessor task not found / Successor task not found",
  })
  @ApiResponse({
    status: 409,
    description: "Dependency đã tồn tại giữa hai task này",
  })
  @Roles("ADMIN", "MANAGER")
  @Post("projects/:projectId/tasks/:taskId/dependencies")
  async createDependency(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
    @Body() dto: CreateTaskDependencyDto,
  ): Promise<CreateTaskDependencyResponseDto> {
    return await this.taskDependencyService.createDependency(
      projectId,
      taskId,
      dto,
    );
  }

  @ApiResponse({
    status: 200,
    description: "Dependency deleted successfully",
    type: DeleteTaskDependencyResponseDto,
  })
  @ApiResponse({ status: 404, description: "Dependency not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete("task-dependencies/:id")
  async removeDependency(
    @Param("id") id: string,
  ): Promise<DeleteTaskDependencyResponseDto> {
    return await this.taskDependencyService.removeDependency(id);
  }
}
