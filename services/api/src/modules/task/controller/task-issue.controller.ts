import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { TaskIssueService } from "../service/task-issue.service";
import {
  CreateTaskIssueDto,
  CreateTaskIssueResponseDto,
} from "../dto/issue/create-task-issue.dto";
import { FindIssueResponseDto } from "../dto/issue/find-issue.dto";
import {
  UpdateIssueDto,
  UpdateIssueResponseDto,
} from "../dto/issue/update-issue.dto";

@Controller()
@ApiTags("Issues")
@ApiBearerAuth()
export class TaskIssueController {
  constructor(private readonly taskIssueService: TaskIssueService) {}

  @ApiResponse({
    status: 200,
    description: "Task issues retrieved successfully",
    type: FindIssueResponseDto,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Get("tasks/:taskId/issues")
  async findByTask(@Param("taskId") taskId: string): Promise<{
    issues: Array<{
      id: string;
      title: string;
      description: string | null;
      dueDate: Date | null;
      resolvedAt: Date | null;
      createdAt: Date;
      reportedBy: { id: string; name: string; avatarUrl: string };
      assignee: { id: string; name: string; avatarUrl: string };
    }>;
  }> {
    return await this.taskIssueService.findIssuesByTask(taskId);
  }

  @ApiResponse({
    status: 200,
    description: "Issue retrieved successfully",
    type: FindIssueResponseDto,
  })
  @ApiResponse({ status: 404, description: "Issue not found" })
  @Get("issues/:issueId")
  async findOne(
    @Param("issueId") issueId: string,
  ): Promise<FindIssueResponseDto> {
    return await this.taskIssueService.findIssue(issueId);
  }

  @ApiResponse({
    status: 201,
    description: "Issue created successfully",
    type: CreateTaskIssueResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Task not found / Assignee not found",
  })
  @Post("tasks/:taskId/issues")
  async create(
    @Param("taskId") taskId: string,
    @Body() dto: CreateTaskIssueDto,
    @CurrentUser() user: { id: string },
  ): Promise<CreateTaskIssueResponseDto> {
    return await this.taskIssueService.createIssue(taskId, dto, user.id);
  }

  @ApiResponse({
    status: 200,
    description: "Issue updated successfully",
    type: UpdateIssueResponseDto,
  })
  @ApiResponse({ status: 404, description: "Issue not found" })
  @ApiResponse({ status: 403, description: "Không có quyền sửa" })
  @Patch("issues/:issueId")
  async update(
    @Param("issueId") issueId: string,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<UpdateIssueResponseDto> {
    return await this.taskIssueService.updateIssue(issueId, dto, user);
  }

  @ApiResponse({
    status: 200,
    description: "Issue deleted successfully",
    schema: { example: { message: "Issue deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Issue not found" })
  @ApiResponse({ status: 403, description: "Không có quyền xóa" })
  @Delete("issues/:issueId")
  async remove(
    @Param("issueId") issueId: string,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<{ message: string }> {
    return await this.taskIssueService.removeIssue(issueId, user);
  }
}
