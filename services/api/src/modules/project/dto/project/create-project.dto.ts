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
import { ProjectDto } from "../../../shared/dto/project.dto";

export class CreateProjectDto {
  @ApiProperty({ example: "Project ABC" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @ApiPropertyOptional({ example: "Project description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

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
export class CreateProjectResponseDto {
  @ApiProperty({ type: ProjectDto })
  @Expose()
  @Type(() => ProjectDto)
  project!: ProjectDto;
}
