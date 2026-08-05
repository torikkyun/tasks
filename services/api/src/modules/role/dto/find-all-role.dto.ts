import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { RoleDto } from "@/modules/shared/dto/role.dto";

@Exclude()
export class FindAllRoleResponseDto {
  @ApiProperty({ type: [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles!: RoleDto[];
}
