import { ApiProperty } from "@nestjs/swagger";
import { DepartmentDto } from "./department.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllDepartmentResponseDto {
  @ApiProperty({ type: [DepartmentDto] })
  @Expose()
  @Type(() => DepartmentDto)
  departments!: DepartmentDto[];
}
