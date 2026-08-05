import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ProjectMilestoneStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "On Track" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ON_TRACK" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectMilestonePhaseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Phase 1" })
  @Expose()
  name!: string;
}

@Exclude()
export class ProjectMilestoneDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Milestone 1" })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ example: "Milestone description", nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ example: "2026-08-28" })
  @Expose()
  dueDate!: Date;

  @ApiPropertyOptional({ example: "2026-09-01", nullable: true })
  @Expose()
  completedDate!: Date | null;

  @ApiProperty({ type: ProjectMilestoneStatusDto })
  @Expose()
  @Type(() => ProjectMilestoneStatusDto)
  status!: ProjectMilestoneStatusDto;

  @ApiPropertyOptional({ type: ProjectMilestonePhaseDto, nullable: true })
  @Expose()
  @Type(() => ProjectMilestonePhaseDto)
  phase!: ProjectMilestonePhaseDto | null;
}
