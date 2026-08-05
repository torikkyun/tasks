import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { ProjectMilestoneDto } from "../../../shared/dto/milestone.dto";

export class CreateProjectMilestoneDto {
  @ApiProperty({ example: "Milestone 1" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @ApiPropertyOptional({ example: "Milestone description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ example: "2026-08-28" })
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({ example: "2026-09-01" })
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  phaseId?: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  statusId!: string;
}

@Exclude()
export class CreateProjectMilestoneResponseDto {
  @ApiProperty({ type: ProjectMilestoneDto })
  @Expose()
  @Type(() => ProjectMilestoneDto)
  milestone!: ProjectMilestoneDto;
}
