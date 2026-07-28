import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, Matches, Length } from "class-validator";
import { StaffDto } from "./staff.dto";

export class UpdateStaffDto {
  @ApiPropertyOptional({ example: "Nguyen Van A" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: "+84900123456" })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{7,15}$/, {
    message: "Phone number must contain only digits and optional leading +",
  })
  phone?: string;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}

@Exclude()
export class UpdateStaffResponseDto {
  @ApiProperty({ type: StaffDto })
  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto;
}
