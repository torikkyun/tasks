import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DepartmentDto } from "@/modules/department/dto/department.dto";
import { MemberRoleDto } from "@/modules/member-role/dto/member-role.dto";
import { MemberDto } from "./project-member.dto";

@Exclude()
export class ProjectMemberListMemberDto extends MemberDto {
  @ApiProperty({ example: "a@example.com" })
  @Expose()
  email!: string;

  @ApiProperty({ type: DepartmentDto })
  @Expose()
  @Type(() => DepartmentDto)
  department!: DepartmentDto;
}

@Exclude()
export class ProjectMemberListDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "2026-07-28" })
  @Expose()
  joinedAt!: Date;

  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  @Expose()
  leftAt!: Date | null;

  @ApiProperty({ type: ProjectMemberListMemberDto })
  @Expose()
  @Type(() => ProjectMemberListMemberDto)
  member!: ProjectMemberListMemberDto;

  @ApiProperty({ type: MemberRoleDto })
  @Expose()
  @Type(() => MemberRoleDto)
  memberRole!: MemberRoleDto;
}

@Exclude()
export class FindAllProjectMembersResponseDto {
  @ApiProperty({ type: [ProjectMemberListDto] })
  @Expose()
  @Type(() => ProjectMemberListDto)
  members!: ProjectMemberListDto[];
}
