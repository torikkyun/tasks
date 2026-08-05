import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ProjectStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Lên kế hoạch" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "PLANNING" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({
    example: "Trạng thái dự án đang lên kế hoạch",
    nullable: true,
  })
  @Expose()
  description!: string | null;
}
