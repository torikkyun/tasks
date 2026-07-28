import { ApiProperty } from "@nestjs/swagger";
import { PhaseStatusDto } from "./phase-status.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllPhaseStatusResponseDto {
  @ApiProperty({ type: [PhaseStatusDto] })
  @Expose()
  @Type(() => PhaseStatusDto)
  phaseStatuses!: PhaseStatusDto[];
}
