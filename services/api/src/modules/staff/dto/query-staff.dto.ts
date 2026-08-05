import { MetaDto } from "@/common/dto/meta.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { OffsetPaginationQueryDto } from "@/common/dto/offset-pagination-query.dto";
import { StaffDto } from "@/modules/shared/dto/staff.dto";

export class QueryStaffDto extends OffsetPaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: "Tìm kiếm theo tên hoặc email" })
  search?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: "Lọc theo id vai trò" })
  roleId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: "Lọc theo id phòng ban" })
  departmentId?: string;
}

@Exclude()
export class FindAllStaffResponseDto {
  @ApiProperty({ type: [StaffDto] })
  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto[];

  @ApiProperty({ type: MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta!: MetaDto;
}
