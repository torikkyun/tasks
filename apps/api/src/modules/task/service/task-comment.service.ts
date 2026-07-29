import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
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

@Injectable()
export class TaskCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findComments(
    taskId: string,
    query: { page?: number; limit?: number },
  ): Promise<{
    comments: FindAllTaskCommentsResponseDto["comments"];
    meta: TaskCommentsMetaDto;
  }> {
    const { page = 1, limit = 20 } = query;
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const where = { taskId };
    const total = await this.prisma.comment.count({ where });
    const comments = await this.prisma.comment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
      include: { staff: true },
    });

    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        staff: {
          id: comment.staff.id,
          name: comment.staff.name,
          avatarUrl: comment.staff.avatarUrl,
        },
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createComment(
    taskId: string,
    dto: CreateTaskCommentDto,
    userId: string,
  ): Promise<CreateTaskCommentResponseDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        task: { connect: { id: taskId } },
        staff: { connect: { id: userId } },
      },
      include: { staff: true },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      staff: {
        id: comment.staff.id,
        name: comment.staff.name,
        avatarUrl: comment.staff.avatarUrl,
      },
    };
  }

  async updateComment(
    taskId: string,
    commentId: string,
    dto: UpdateTaskCommentDto,
    user: { id: string; role: { code: string } },
  ): Promise<UpdateTaskCommentResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, taskId },
      select: { id: true, staffId: true },
    });
    if (!comment) throw new NotFoundException("Comment not found");
    if (comment.staffId !== user.id)
      throw new ForbiddenException("Không phải chủ comment");

    return await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      select: { id: true, content: true, updatedAt: true },
    });
  }

  async removeComment(
    taskId: string,
    commentId: string,
    user: { id: string; role: { code: string } },
  ): Promise<DeleteTaskCommentResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, taskId },
      select: { id: true, staffId: true },
    });
    if (!comment) throw new NotFoundException("Comment not found");
    if (comment.staffId !== user.id && user.role.code !== "ADMIN") {
      throw new ForbiddenException("Không có quyền xóa");
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: "Comment deleted successfully" };
  }
}
