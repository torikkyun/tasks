import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ProjectStatusDto } from "@/modules/project-status/dto/project-status.dto";

@Exclude()
export class ProjectDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Project ABC" })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ example: "Project description", nullable: true })
  @Expose()
  description!: string | null;

  @ApiPropertyOptional({ example: "2026-07-28", nullable: true })
  @Expose()
  startDate!: Date | null;

  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  @Expose()
  endDate!: Date | null;

  @ApiProperty({ example: "2026-07-28T12:34:56.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: ProjectStatusDto })
  @Expose()
  @Type(() => ProjectStatusDto)
  status!: ProjectStatusDto;
}
