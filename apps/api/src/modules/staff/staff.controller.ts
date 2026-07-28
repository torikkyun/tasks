import { Controller, Get, Param, Query } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { QueryStaffDto } from "./dto/query-staff.dto";
import { FindAllStaffResponseDto } from "./dto/find-all-staff.dto";
import { FindOneStaffResponseDto } from "./dto/find-one-staff.dto";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("staff")
@ApiBearerAuth()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiResponse({
    status: 200,
    description: "Staff list retrieved successfully",
    type: FindAllStaffResponseDto,
  })
  @Roles("ADMIN", "MANAGER")
  @Get()
  async findAll(
    @Query() query: QueryStaffDto,
  ): Promise<FindAllStaffResponseDto> {
    return await this.staffService.findAll(query);
  }

  @ApiResponse({
    status: 200,
    description: "Staff retrieved successfully",
    type: FindOneStaffResponseDto,
  })
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<FindOneStaffResponseDto> {
    return await this.staffService.findOne(id);
  }
}
