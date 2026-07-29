import { Module } from "@nestjs/common";
import { TaskCommentController } from "./controller/task-comment.controller";
import { TaskAttachmentController } from "./controller/task-attachment.controller";
import { TaskController } from "./controller/task.controller";
import { TaskDependencyController } from "./controller/task-dependency.controller";
import { TaskIssueController } from "./controller/task-issue.controller";
import { TaskAttachmentService } from "./service/task-attachment.service";
import { TaskCommentService } from "./service/task-comment.service";
import { TaskDependencyService } from "./service/task-dependency.service";
import { TaskIssueService } from "./service/task-issue.service";
import { TaskService } from "./service/task.service";

@Module({
  controllers: [
    TaskController,
    TaskDependencyController,
    TaskCommentController,
    TaskIssueController,
    TaskAttachmentController,
  ],
  providers: [
    TaskService,
    TaskAttachmentService,
    TaskCommentService,
    TaskDependencyService,
    TaskIssueService,
  ],
})
export class TaskModule {}
