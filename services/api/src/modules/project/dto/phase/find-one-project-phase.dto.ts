import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  ProjectPhaseDto,
  ProjectPhaseMilestoneDto,
} from "../../../shared/dto/phase.dto";

@Exclude()
export class ProjectPhaseDetailDto extends ProjectPhaseDto {
  @ApiProperty({ type: [ProjectPhaseMilestoneDto] })
  @Expose()
  @Type(() => ProjectPhaseMilestoneDto)
  milestones!: ProjectPhaseMilestoneDto[];
}

@Exclude()
export class FindOneProjectPhaseResponseDto {
  @ApiProperty({ type: ProjectPhaseDetailDto })
  @Expose()
  @Type(() => ProjectPhaseDetailDto)
  phase!: ProjectPhaseDetailDto;
}
