import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { StaffDto } from "@/modules/staff/dto/staff.dto";

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
