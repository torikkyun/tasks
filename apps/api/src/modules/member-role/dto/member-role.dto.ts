import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MemberRoleDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Developer" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "DEVELOPER" })
  @Expose()
  code!: string;

  @ApiPropertyOptional({ example: "Developer in project", nullable: true })
  @Expose()
  description!: string | null;
}
