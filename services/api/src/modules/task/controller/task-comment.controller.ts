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
import { TaskCommentService } from "../service/task-comment.service";
import {
  CreateTaskCommentDto,
  CreateTaskCommentResponseDto,
} from "../dto/comment/create-task-comment.dto";
import { DeleteTaskCommentResponseDto } from "../dto/comment/delete-task-comment.dto";
import {
  FindAllTaskCommentsResponseDto,
  TaskCommentsMetaDto,
} from "../dto/comment/find-all-task-comments.dto";
import {
  UpdateTaskCommentDto,
  UpdateTaskCommentResponseDto,
} from "../dto/comment/update-task-comment.dto";

@Controller("tasks/:taskId/comments")
@ApiTags("Task Comments")
@ApiBearerAuth()
export class TaskCommentController {
  constructor(private readonly taskCommentService: TaskCommentService) {}

  @ApiResponse({
    status: 200,
    description: "Task comments retrieved successfully",
    type: FindAllTaskCommentsResponseDto,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Get()
  async findAll(
    @Param("taskId") taskId: string,
    @Query() query: { page?: number; limit?: number },
  ): Promise<{
    comments: FindAllTaskCommentsResponseDto["comments"];
    meta: TaskCommentsMetaDto;
  }> {
    return await this.taskCommentService.findComments(taskId, query);
  }

  @ApiResponse({
    status: 201,
    description: "Task comment created successfully",
    type: CreateTaskCommentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @Post()
  async create(
    @Param("taskId") taskId: string,
    @Body() dto: CreateTaskCommentDto,
    @CurrentUser() user: { id: string },
  ): Promise<CreateTaskCommentResponseDto> {
    return await this.taskCommentService.createComment(taskId, dto, user.id);
  }

  @ApiResponse({
    status: 200,
    description: "Task comment updated successfully",
    type: UpdateTaskCommentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  @ApiResponse({ status: 403, description: "Không phải chủ comment" })
  @Patch(":commentId")
  async update(
    @Param("taskId") taskId: string,
    @Param("commentId") commentId: string,
    @Body() dto: UpdateTaskCommentDto,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<UpdateTaskCommentResponseDto> {
    return await this.taskCommentService.updateComment(
      taskId,
      commentId,
      dto,
      user,
    );
  }

  @ApiResponse({
    status: 200,
    description: "Comment deleted successfully",
    type: DeleteTaskCommentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Comment not found" })
  @ApiResponse({ status: 403, description: "Không có quyền xóa" })
  @Delete(":commentId")
  async remove(
    @Param("taskId") taskId: string,
    @Param("commentId") commentId: string,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<DeleteTaskCommentResponseDto> {
    return await this.taskCommentService.removeComment(taskId, commentId, user);
  }
}
