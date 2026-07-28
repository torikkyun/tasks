import { ApiProperty } from "@nestjs/swagger";
import { RoleDto } from "./role.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllRoleResponseDto {
  @ApiProperty({ type: [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles!: RoleDto[];
}
