import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ProjectGanttProjectStatusDto {
  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectGanttProjectDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Project A" })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  startDate!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  endDate!: Date | null;

  @ApiProperty({ type: ProjectGanttProjectStatusDto })
  @Expose()
  @Type(() => ProjectGanttProjectStatusDto)
  status!: ProjectGanttProjectStatusDto;
}

@Exclude()
export class ProjectGanttPhaseStatusDto {
  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectGanttPhaseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Phase 1" })
  @Expose()
  name!: string;

  @ApiProperty({ example: 0 })
  @Expose()
  sortOrder!: number;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  startDate!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  endDate!: Date | null;

  @ApiProperty({ type: ProjectGanttPhaseStatusDto })
  @Expose()
  @Type(() => ProjectGanttPhaseStatusDto)
  status!: ProjectGanttPhaseStatusDto;
}

@Exclude()
export class ProjectGanttMilestoneStatusDto {
  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectGanttMilestoneDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Milestone 1" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "2026-08-28" })
  @Expose()
  dueDate!: Date;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  completedDate!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  phaseId!: string | null;

  @ApiProperty({ type: ProjectGanttMilestoneStatusDto })
  @Expose()
  @Type(() => ProjectGanttMilestoneStatusDto)
  status!: ProjectGanttMilestoneStatusDto;
}

@Exclude()
export class ProjectGanttTaskUserDto {
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
export class ProjectGanttTaskStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectGanttTaskPriorityDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "HIGH" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectGanttTaskDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Task 1" })
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  startDate!: Date;

  @ApiProperty()
  @Expose()
  endDate!: Date;

  @ApiProperty({ example: 0 })
  @Expose()
  progressPercent!: number;

  @ApiProperty({ example: 0 })
  @Expose()
  sortOrder!: number;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  parentTaskId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  phaseId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  milestoneId!: string | null;

  @ApiProperty({ type: ProjectGanttTaskUserDto, nullable: true })
  @Expose()
  @Type(() => ProjectGanttTaskUserDto)
  assignee!: ProjectGanttTaskUserDto | null;

  @ApiProperty({ type: ProjectGanttTaskStatusDto })
  @Expose()
  @Type(() => ProjectGanttTaskStatusDto)
  status!: ProjectGanttTaskStatusDto;

  @ApiProperty({ type: ProjectGanttTaskPriorityDto })
  @Expose()
  @Type(() => ProjectGanttTaskPriorityDto)
  priority!: ProjectGanttTaskPriorityDto;
}

@Exclude()
export class ProjectGanttDependencyDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  predecessorTaskId!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  successorTaskId!: string;

  @ApiProperty({ example: "FS" })
  @Expose()
  dependencyType!: string;

  @ApiProperty({ example: 0 })
  @Expose()
  lagDays!: number;
}

@Exclude()
export class FindProjectGanttResponseDto {
  @ApiProperty({ type: ProjectGanttProjectDto })
  @Expose()
  @Type(() => ProjectGanttProjectDto)
  project!: ProjectGanttProjectDto;

  @ApiProperty({ type: [ProjectGanttPhaseDto] })
  @Expose()
  @Type(() => ProjectGanttPhaseDto)
  phases!: ProjectGanttPhaseDto[];

  @ApiProperty({ type: [ProjectGanttMilestoneDto] })
  @Expose()
  @Type(() => ProjectGanttMilestoneDto)
  milestones!: ProjectGanttMilestoneDto[];

  @ApiProperty({ type: [ProjectGanttTaskDto] })
  @Expose()
  @Type(() => ProjectGanttTaskDto)
  tasks!: ProjectGanttTaskDto[];

  @ApiProperty({ type: [ProjectGanttDependencyDto] })
  @Expose()
  @Type(() => ProjectGanttDependencyDto)
  dependencies!: ProjectGanttDependencyDto[];
}
