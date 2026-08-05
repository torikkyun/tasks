import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from "class-validator";
import { ProjectPhaseDto } from "../../../shared/dto/phase.dto";

export class CreateProjectPhaseDto {
  @ApiProperty({ example: "Phase 1" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @ApiPropertyOptional({ example: "Phase description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: "2026-07-28" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-08-28" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  statusId!: string;
}

@Exclude()
export class CreateProjectPhaseResponseDto {
  @ApiProperty({ type: ProjectPhaseDto })
  @Expose()
  @Type(() => ProjectPhaseDto)
  phase!: ProjectPhaseDto;
}
