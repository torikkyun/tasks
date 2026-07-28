import { Controller, Get } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllDepartmentResponseDto } from "./dto/find-all-department.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller("departments")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiResponse({
    status: 200,
    description: "Departments retrieved successfully",
    type: FindAllDepartmentResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllDepartmentResponseDto> {
    return await this.departmentService.findAll();
  }
}
