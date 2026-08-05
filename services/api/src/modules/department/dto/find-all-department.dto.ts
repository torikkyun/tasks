import { DepartmentDto } from "@/modules/shared/dto/department.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllDepartmentResponseDto {
  @ApiProperty({ type: [DepartmentDto] })
  @Expose()
  @Type(() => DepartmentDto)
  departments!: DepartmentDto[];
}
