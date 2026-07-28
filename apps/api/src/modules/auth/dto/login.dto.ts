import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
class RoleDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Admin" })
  @Expose()
  name!: string;
}

@Exclude()
class DepartmentDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Human Resources" })
  @Expose()
  name!: string;
}

@Exclude()
class StaffDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "John Doe" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "john@gmail.com" })
  @Expose()
  email!: string;

  @ApiProperty({ example: "0987654321" })
  @Expose()
  phone!: string;

  @ApiProperty({ example: "https://example.com/avatar.jpg" })
  @Expose()
  avatarUrl!: string;

  @ApiProperty({ type: RoleDto })
  @Expose()
  @Type(() => RoleDto)
  role!: RoleDto;

  @ApiProperty({ type: DepartmentDto })
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
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  @Expose()
  accessToken!: string;

  @ApiProperty({ type: StaffDto })
  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto;
}
