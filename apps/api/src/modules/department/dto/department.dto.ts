import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DepartmentDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Engineering" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ENG" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Engineering department", nullable: true })
  @Expose()
  description!: string | null;
}
