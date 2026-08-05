import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from "class-validator";
import { ProjectPhaseDto } from "./phase.dto";

export class UpdateProjectPhaseDto {
  @ApiPropertyOptional({ example: "Phase 1" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "Phase description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: "2026-07-28" })
  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @ApiPropertyOptional({ example: "2026-08-28" })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  statusId?: string;
}

@Exclude()
export class UpdateProjectPhaseResponseDto {
  @ApiPropertyOptional({ type: ProjectPhaseDto })
  @Expose()
  @Type(() => ProjectPhaseDto)
  phase!: ProjectPhaseDto;
}
