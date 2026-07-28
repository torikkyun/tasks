import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PhaseStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Not Started" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "NOT_STARTED" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Phase is not started", nullable: true })
  @Expose()
  description!: string | null;
}
