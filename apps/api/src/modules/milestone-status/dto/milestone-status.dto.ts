import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MilestoneStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "On Track" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ON_TRACK" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Milestone is on track", nullable: true })
  @Expose()
  description!: string | null;
}
