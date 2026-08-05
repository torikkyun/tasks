import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TaskStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Cần làm" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "TODO" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Trạng thái tác vụ cần làm", nullable: true })
  @Expose()
  description!: string | null;
}
