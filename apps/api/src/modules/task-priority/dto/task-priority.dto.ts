import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TaskPriorityDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "High" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "HIGH" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "High priority task", nullable: true })
  @Expose()
  description!: string | null;
}
