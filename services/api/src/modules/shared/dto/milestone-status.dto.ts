import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MilestoneStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Đã đạt" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ACHIEVED" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({
    example: "Trạng thái mốc đã hoàn thành",
    nullable: true,
  })
  @Expose()
  description!: string | null;
}
