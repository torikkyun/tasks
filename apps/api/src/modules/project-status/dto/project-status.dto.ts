import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ProjectStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Active" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ACTIVE" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Project currently active", nullable: true })
  @Expose()
  description!: string | null;
}
