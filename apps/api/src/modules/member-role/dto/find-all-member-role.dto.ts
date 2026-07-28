import { ApiProperty } from "@nestjs/swagger";
import { MemberRoleDto } from "./member-role.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllResponseDto {
  @ApiProperty({ type: [MemberRoleDto] })
  @Expose()
  @Type(() => MemberRoleDto)
  memberRoles!: MemberRoleDto[];
}
