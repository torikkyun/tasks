import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RoleDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Administrator" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "ADMIN" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Vai trò quản trị viên", nullable: true })
  @Expose()
  description!: string | null;
}
