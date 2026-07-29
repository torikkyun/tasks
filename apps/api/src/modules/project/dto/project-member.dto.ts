import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { MemberRoleDto } from "@/modules/member-role/dto/member-role.dto";

@Exclude()
export class MemberDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "https://example.com/avatar.png" })
  @Expose()
  avatarUrl!: string;
}

@Exclude()
export class ProjectMemberDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "2026-07-28" })
  @Expose()
  joinedAt!: Date;

  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  @Expose()
  leftAt!: Date | null;

  @ApiProperty({ type: MemberDto })
  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;

  @ApiProperty({ type: MemberRoleDto })
  @Expose()
  @Type(() => MemberRoleDto)
  memberRole!: MemberRoleDto;
}
