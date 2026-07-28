import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class QueryStaffDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Search by name or email" })
  search?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: "Filter by role id" })
  roleId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: "Filter by department id" })
  departmentId?: string;
}
