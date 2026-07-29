import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";
import { ProjectDto } from "./project.dto";

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: "Project ABC" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "Project description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ApiPropertyOptional({ example: "2026-07-28" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-08-28" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  statusId?: string;
}

@Exclude()
export class UpdateProjectResponseDto {
  @ApiProperty({ type: ProjectDto })
  @Expose()
  @Type(() => ProjectDto)
  project!: ProjectDto;
}
