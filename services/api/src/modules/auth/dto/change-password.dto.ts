import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "thisisapassword123" })
  @IsString()
  @Length(8, 32, { message: "Mật khẩu phải có độ dài từ 8 đến 32 ký tự" })
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({ example: "thisisanewpassword456" })
  @IsString()
  @IsString()
  @Length(8, 32, { message: "Mật khẩu phải có độ dài từ 8 đến 32 ký tự" })
  @IsNotEmpty()
  newPassword!: string;
}
