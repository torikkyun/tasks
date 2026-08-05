import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from "class-validator";
import { TaskListItemDto } from "./task.dto";

export class UpdateProjectTaskDto {
  @ApiPropertyOptional({ example: "Task 1" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "Task description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ApiPropertyOptional({ example: "2026-07-29" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-07-30" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  plannedHours?: number | null;

  @ApiPropertyOptional({ example: 8, nullable: true })
  @IsOptional()
  @IsNumber()
  actualHours?: number | null;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  statusId?: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  priorityId?: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentTaskId?: string | null;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  phaseId?: string | null;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  milestoneId?: string | null;
}

@Exclude()
export class UpdateProjectTaskResponseDto {
  @ApiPropertyOptional({ type: TaskListItemDto })
  @Expose()
  @Type(() => TaskListItemDto)
  task!: TaskListItemDto;
}
