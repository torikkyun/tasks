import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MemberRoleDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Thành viên" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "MEMBER" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Vai trò thành viên dự án", nullable: true })
  @Expose()
  description!: string | null;
}
