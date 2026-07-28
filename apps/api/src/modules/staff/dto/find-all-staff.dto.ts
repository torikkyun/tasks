import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { StaffDto } from "./staff.dto";

class MetaDto {
  @ApiProperty({ example: 100 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  limit!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  totalPages!: number;
}

@Exclude()
export class FindAllStaffResponseDto {
  @ApiProperty({ type: [StaffDto] })
  @Expose()
  @Type(() => StaffDto)
  staffs!: StaffDto[];

  @ApiProperty({ type: MetaDto })
  @Expose()
  @Type(() => MetaDto)
  meta!: MetaDto;
}
