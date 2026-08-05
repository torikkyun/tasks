import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ProjectMilestoneDto } from "../../../shared/dto/milestone.dto";

@Exclude()
export class FindAllProjectMilestonesResponseDto {
  @ApiProperty({ type: [ProjectMilestoneDto] })
  @Expose()
  @Type(() => ProjectMilestoneDto)
  milestones!: ProjectMilestoneDto[];
}
