import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ProjectPhaseDto } from "./phase.dto";

@Exclude()
export class FindAllProjectPhasesResponseDto {
  @ApiProperty({ type: [ProjectPhaseDto] })
  @Expose()
  @Type(() => ProjectPhaseDto)
  phases!: ProjectPhaseDto[];
}
