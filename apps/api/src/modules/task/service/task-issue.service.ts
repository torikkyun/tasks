import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import {
  CreateTaskIssueDto,
  CreateTaskIssueResponseDto,
} from "../dto/issue/create-task-issue.dto";
import { FindIssueResponseDto } from "../dto/issue/find-issue.dto";
import {
  UpdateIssueDto,
  UpdateIssueResponseDto,
} from "../dto/issue/update-issue.dto";

@Injectable()
export class TaskIssueService {
  constructor(private readonly prisma: PrismaService) {}

  async findIssuesByTask(taskId: string): Promise<{
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
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const issues = await this.prisma.issue.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: { reportedBy: true, assignee: true },
    });

    return {
      issues: issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        dueDate: issue.dueDate,
        resolvedAt: issue.resolvedAt,
        createdAt: issue.createdAt,
        reportedBy: {
          id: issue.reportedBy.id,
          name: issue.reportedBy.name,
          avatarUrl: issue.reportedBy.avatarUrl,
        },
        assignee: {
          id: issue.assignee.id,
          name: issue.assignee.name,
          avatarUrl: issue.assignee.avatarUrl,
        },
      })),
    };
  }

  async findIssue(issueId: string): Promise<FindIssueResponseDto> {
    const issue = await this.prisma.issue.findFirst({
      where: { id: issueId },
      include: { task: true, reportedBy: true, assignee: true },
    });
    if (!issue) throw new NotFoundException("Issue not found");
    return {
      issue: {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        dueDate: issue.dueDate,
        resolvedAt: issue.resolvedAt,
        createdAt: issue.createdAt,
        task: { id: issue.task.id, name: issue.task.name },
        reportedBy: {
          id: issue.reportedBy.id,
          name: issue.reportedBy.name,
          avatarUrl: issue.reportedBy.avatarUrl,
        },
        assignee: {
          id: issue.assignee.id,
          name: issue.assignee.name,
          avatarUrl: issue.assignee.avatarUrl,
        },
      },
    };
  }

  async createIssue(
    taskId: string,
    dto: CreateTaskIssueDto,
    userId: string,
  ): Promise<CreateTaskIssueResponseDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const assignee = await this.prisma.staff.findFirst({
      where: { id: dto.assigneeId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!assignee) throw new NotFoundException("Assignee not found");

    const issue = await this.prisma.issue.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        reportedBy: { connect: { id: userId } },
        assignee: { connect: { id: dto.assigneeId } },
        task: { connect: { id: taskId } },
      },
      include: { reportedBy: true, assignee: true },
    });

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      dueDate: issue.dueDate,
      reportedBy: { id: issue.reportedBy.id, name: issue.reportedBy.name },
      assignee: { id: issue.assignee.id, name: issue.assignee.name },
    };
  }

  async updateIssue(
    issueId: string,
    dto: UpdateIssueDto,
    user: { id: string; role: { code: string } },
  ): Promise<UpdateIssueResponseDto> {
    const issue = await this.prisma.issue.findFirst({
      where: { id: issueId },
      select: { id: true, reportedById: true, assigneeId: true },
    });
    if (!issue) throw new NotFoundException("Issue not found");
    if (
      issue.reportedById !== user.id &&
      issue.assigneeId !== user.id &&
      user.role.code !== "ADMIN" &&
      user.role.code !== "MANAGER"
    ) {
      throw new ForbiddenException("Không có quyền sửa");
    }

    const updateData: Prisma.IssueUpdateInput = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.dueDate !== undefined)
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.resolvedAt !== undefined)
      updateData.resolvedAt = dto.resolvedAt ? new Date(dto.resolvedAt) : null;
    if (dto.assigneeId !== undefined)
      updateData.assignee = { connect: { id: dto.assigneeId } };

    return await this.prisma.issue.update({
      where: { id: issueId },
      data: updateData,
      select: {
        id: true,
        title: true,
        resolvedAt: true,
        assignee: { select: { id: true, name: true } },
      },
    });
  }

  async removeIssue(
    issueId: string,
    user: { id: string; role: { code: string } },
  ): Promise<{ message: string }> {
    const issue = await this.prisma.issue.findFirst({
      where: { id: issueId },
      select: { id: true, reportedById: true },
    });
    if (!issue) throw new NotFoundException("Issue not found");
    if (issue.reportedById !== user.id && user.role.code !== "ADMIN") {
      throw new ForbiddenException("Không có quyền xóa");
    }
    await this.prisma.issue.delete({ where: { id: issueId } });
    return { message: "Issue deleted successfully" };
  }
}
