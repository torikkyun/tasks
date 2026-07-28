import { ApiProperty } from "@nestjs/swagger";
import { MilestoneStatusDto } from "./milestone-status.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllMilestoneStatusResponseDto {
  @ApiProperty({ type: [MilestoneStatusDto] })
  @Expose()
  @Type(() => MilestoneStatusDto)
  milestoneStatuses!: MilestoneStatusDto[];
}
