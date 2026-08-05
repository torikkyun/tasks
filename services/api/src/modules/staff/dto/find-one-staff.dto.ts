import { StaffDto } from "@/modules/shared/dto/staff.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindOneStaffResponseDto {
  @ApiProperty({ type: StaffDto })
  @Expose()
  @Type(() => StaffDto)
  staff!: StaffDto;
}
