import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Roles } from "@/common/decorators/roles.decorator";
import { TaskService } from "../service/task.service";
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

@Controller("projects/:projectId/tasks")
@ApiTags("Project Tasks")
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResponse({
    status: 200,
    description: "Project tasks retrieved successfully",
    type: FindAllProjectTasksResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get()
  async findAll(
    @Param("projectId") projectId: string,
    @Query() query: {
      phaseId?: string;
      milestoneId?: string;
      assigneeId?: string;
      statusId?: string;
      priorityId?: string;
      parentTaskId?: string | null;
    },
  ): Promise<FindAllProjectTasksResponseDto> {
    return await this.taskService.findAll(projectId, query);
  }

  @ApiResponse({
    status: 200,
    description: "Project task retrieved successfully",
    type: FindOneProjectTaskResponseDto,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Get(":taskId")
  async findOne(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
  ): Promise<FindOneProjectTaskResponseDto> {
    return await this.taskService.findOne(projectId, taskId);
  }

  @ApiResponse({
    status: 201,
    description: "Project task created successfully",
    type: CreateProjectTaskResponseDto,
  })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @ApiResponse({
    status: 404,
    description:
      "Project / Status / Priority / Assignee / Phase / Milestone not found",
  })
  @Post()
  async create(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectTaskDto,
    @CurrentUser() user: { id: string },
  ): Promise<CreateProjectTaskResponseDto> {
    return await this.taskService.create(projectId, dto, user.id);
  }

  @ApiResponse({
    status: 200,
    description: "Project task updated successfully",
    type: UpdateProjectTaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "progressPercent phải trong [0, 100]",
  })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Patch(":taskId")
  async update(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateProjectTaskDto,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<UpdateProjectTaskResponseDto> {
    return await this.taskService.update(projectId, taskId, dto, user);
  }

  @ApiResponse({
    status: 200,
    description: "Task deleted successfully",
    schema: { example: { message: "Task deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete(":taskId")
  async remove(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
  ): Promise<{ message: string }> {
    return await this.taskService.remove(projectId, taskId);
  }
}
