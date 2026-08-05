import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { ProjectDto } from "../../../shared/dto/project.dto";
import { MetaDto } from "@/common/dto/meta.dto";

export class QueryProjectDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Search by name" })
  search?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: "Filter by project status id" })
  statusId?: string;
}

@Exclude()
export class FindAllProjectsResponseDto {
  @ApiProperty({ type: [ProjectDto] })
  @Expose()
  @Type(() => ProjectDto)
  projects!: ProjectDto[];

  @ApiProperty({ type: MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta!: MetaDto;
}
