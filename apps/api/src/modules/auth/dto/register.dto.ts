import { IsString, Length, Matches } from "class-validator";
import { LoginDto, LoginResponseDto } from "./login.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @Length(2, 50, { message: "Name must be between 2 and 50 characters" })
  name!: string;

  @ApiProperty({ example: "1234567890" })
  @IsString()
  @Matches(/^\d{10}$/, { message: "Phone number must be 10 digits" })
  phone!: string;
}

export class RegisterResponseDto extends LoginResponseDto {}
