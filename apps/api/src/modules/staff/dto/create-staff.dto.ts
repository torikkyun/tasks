import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { StaffDto } from "./staff.dto";

export class CreateStaffDto {
  @ApiProperty({ example: "Nguyen Van A" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @ApiProperty({ example: "a@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "+84900123456" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{7,15}$/, {
    message: "Phone number must contain only digits and optional leading +",
  })
  phone!: string;

  @ApiProperty({ example: "P@ssw0rd123" })
  @IsString()
  @IsNotEmpty()
  @Length(6, 128)
  password!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  departmentId!: string;
}

@Exclude()
export class CreateStaffResponseDto {
  @ApiProperty({ type: StaffDto })
  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto;
}
