import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class MetaDto {
  @ApiProperty({ example: 100 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  limit!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  totalPages!: number;
}
