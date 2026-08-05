import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { PhaseStatusDto } from "@/modules/phase-status/dto/phase-status.dto";

@Exclude()
export class ProjectMilestoneStatusDto {
  @ApiProperty({ example: "OPEN" })
  @Expose()
  code!: string;
}

@Exclude()
export class ProjectPhaseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Phase 1" })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ example: "Phase description", nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ example: 0 })
  @Expose()
  sortOrder!: number;

  @ApiPropertyOptional({ example: "2026-07-28", nullable: true })
  @Expose()
  startDate!: Date | null;

  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  @Expose()
  endDate!: Date | null;

  @ApiProperty({ type: PhaseStatusDto })
  @Expose()
  @Type(() => PhaseStatusDto)
  status!: PhaseStatusDto;
}

@Exclude()
export class ProjectPhaseMilestoneDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Milestone 1" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "2026-08-28" })
  @Expose()
  dueDate!: Date;

  @ApiProperty({ type: ProjectMilestoneStatusDto })
  @Expose()
  @Type(() => ProjectMilestoneStatusDto)
  status!: ProjectMilestoneStatusDto;
}
