import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from "class-validator";
import { TaskListItemDto } from "./task.dto";

export class CreateProjectTaskDto {
  @ApiProperty({ example: "Task 1" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @ApiPropertyOptional({ example: "Task description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ example: "2026-07-29" })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: "2026-07-30" })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  plannedHours?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  statusId!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  priorityId!: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentTaskId?: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  phaseId?: string;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  milestoneId?: string;
}

@Exclude()
export class CreateProjectTaskResponseDto {
  @ApiProperty({ type: TaskListItemDto })
  @Expose()
  @Type(() => TaskListItemDto)
  task!: TaskListItemDto;
}
