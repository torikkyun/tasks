import { Module } from "@nestjs/common";
import { TaskPriorityController } from "./task-priority.controller";
import { TaskPriorityService } from "./task-priority.service";

@Module({
  controllers: [TaskPriorityController],
  providers: [TaskPriorityService],
})
export class TaskPriorityModule {}

