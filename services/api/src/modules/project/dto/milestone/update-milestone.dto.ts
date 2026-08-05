import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { ProjectMilestoneDto } from "../../../shared/dto/milestone.dto";

export class UpdateProjectMilestoneDto {
  @ApiPropertyOptional({ example: "Milestone 1" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "Milestone description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ApiPropertyOptional({ example: "2026-08-28" })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: "2026-09-01", nullable: true })
  @IsOptional()
  @IsDateString()
  completedDate?: string | null;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  phaseId?: string | null;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  statusId?: string;
}

@Exclude()
export class UpdateProjectMilestoneResponseDto {
  @ApiPropertyOptional({ type: ProjectMilestoneDto })
  @Expose()
  @Type(() => ProjectMilestoneDto)
  milestone!: ProjectMilestoneDto;
}
