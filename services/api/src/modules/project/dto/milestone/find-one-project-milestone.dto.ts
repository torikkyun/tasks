import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ProjectMilestoneDto } from "./milestone.dto";

@Exclude()
export class FindOneProjectMilestoneResponseDto {
  @ApiProperty({ type: ProjectMilestoneDto })
  @Expose()
  @Type(() => ProjectMilestoneDto)
  milestone!: ProjectMilestoneDto;
}
