import { IsString, Length, Matches } from "class-validator";
import { LoginDto, LoginResponseDto } from "./login.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @Length(2, 50, { message: "Tên phải có độ dài từ 2 đến 50 ký tự" })
  name!: string;

  @ApiProperty({ example: "1234567890" })
  @IsString()
  @Matches(/^\d{10}$/, { message: "Số điện thoại phải có 10 chữ số" })
  phone!: string;
}

export class RegisterResponseDto extends LoginResponseDto {}
