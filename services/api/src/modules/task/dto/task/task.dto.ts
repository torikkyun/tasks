import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class TaskDependencyDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "FS" })
  @Expose()
  dependencyType!: string;

  @ApiProperty({ example: 0 })
  @Expose()
  lagDays!: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  predecessorTaskId!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  successorTaskId!: string;
}

@Exclude()
export class TaskStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Open" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class TaskPriorityDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "High" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "HIGH" })
  @Expose()
  code!: string;
}

@Exclude()
export class TaskAssigneeDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "https://example.com/avatar.png" })
  @Expose()
  avatarUrl!: string;
}

@Exclude()
export class TaskCreatedByDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;
}

@Exclude()
export class TaskPhaseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Phase 1" })
  @Expose()
  name!: string;
}

@Exclude()
export class TaskMilestoneDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Milestone 1" })
  @Expose()
  name!: string;
}

@Exclude()
export class TaskListItemDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Task 1" })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ example: "2026-07-29" })
  @Expose()
  startDate!: Date;

  @ApiProperty({ example: "2026-07-30" })
  @Expose()
  endDate!: Date;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  plannedHours!: string | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  actualHours!: string | null;

  @ApiProperty({ example: 0 })
  @Expose()
  progressPercent!: number;

  @ApiProperty({ example: 0 })
  @Expose()
  sortOrder!: number;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  parentTaskId!: string | null;

  @ApiProperty({ type: TaskStatusDto })
  @Expose()
  @Type(() => TaskStatusDto)
  status!: TaskStatusDto;

  @ApiProperty({ type: TaskPriorityDto })
  @Expose()
  @Type(() => TaskPriorityDto)
  priority!: TaskPriorityDto;

  @ApiPropertyOptional({ type: TaskAssigneeDto, nullable: true })
  @Expose()
  @Type(() => TaskAssigneeDto)
  assignee!: TaskAssigneeDto | null;

  @ApiPropertyOptional({ type: TaskPhaseDto, nullable: true })
  @Expose()
  @Type(() => TaskPhaseDto)
  phase!: TaskPhaseDto | null;

  @ApiPropertyOptional({ type: TaskMilestoneDto, nullable: true })
  @Expose()
  @Type(() => TaskMilestoneDto)
  milestone!: TaskMilestoneDto | null;

  @ApiProperty({ type: [TaskDependencyDto] })
  @Expose()
  @Type(() => TaskDependencyDto)
  dependencies!: TaskDependencyDto[];
}

@Exclude()
export class TaskDetailChildDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Task 1.1" })
  @Expose()
  name!: string;

  @ApiProperty({ example: 50 })
  @Expose()
  progressPercent!: number;

  @ApiProperty({ type: TaskStatusDto })
  @Expose()
  @Type(() => TaskStatusDto)
  status!: Pick<TaskStatusDto, "code">;
}

@Exclude()
export class TaskDetailDto extends TaskListItemDto {
  @ApiProperty({ type: TaskCreatedByDto })
  @Expose()
  @Type(() => TaskCreatedByDto)
  createdBy!: TaskCreatedByDto;

  @ApiProperty({ type: [TaskDetailChildDto] })
  @Expose()
  @Type(() => TaskDetailChildDto)
  childTasks!: TaskDetailChildDto[];
}
