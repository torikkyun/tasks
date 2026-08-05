import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PhaseStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Đang thực hiện" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "IN_PROGRESS" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({
    example: "Trạng thái giai đoạn đang tiến hành",
    nullable: true,
  })
  @Expose()
  description!: string | null;
}
