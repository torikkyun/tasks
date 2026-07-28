import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "thisisapassword123" })
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({ example: "thisisanewpassword456" })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
