import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { DepartmentDto } from "./department.dto";
import { RoleDto } from "./role.dto";

@Exclude()
export class StaffDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "a@example.com" })
  @Expose()
  email!: string;

  @ApiProperty({ example: "+84900123456" })
  @Expose()
  phone!: string;

  @ApiProperty({ example: "https://example.com/avatar.png" })
  @Expose()
  avatarUrl!: string;

  @ApiProperty({ example: "2026-07-28T12:34:56.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: RoleDto })
  @Expose()
  @Type(() => RoleDto)
  role!: RoleDto;

  @ApiProperty({ type: DepartmentDto })
  @Expose()
  @Type(() => DepartmentDto)
  department!: DepartmentDto;
}
