import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
class RoleDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  roleName!: string;
}

@Exclude()
class DepartmentDto {
  @ApiProperty()
  @Expose()
  id!: string;

  @ApiProperty()
  @Expose()
  departmentName!: string;
}

@Exclude()
class StaffDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  phone!: string;

  @Expose()
  avatarUrl!: string;

  @Expose()
  @Type(() => RoleDto)
  role!: RoleDto;

  @Expose()
  @Type(() => DepartmentDto)
  department!: DepartmentDto;
}

export class LoginDto {
  @ApiProperty({ example: "john@gmail.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "thisisapassword123" })
  @IsString()
  @Length(8, 32, { message: "Password must be between 8 and 32 characters" })
  password!: string;
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  accessToken!: string;

  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto;
}
