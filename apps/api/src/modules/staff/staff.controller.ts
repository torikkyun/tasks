import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { StaffService } from "./staff.service";
import { QueryStaffDto } from "./dto/query-staff.dto";
import { CreateStaffDto, CreateStaffResponseDto } from "./dto/create-staff.dto";
import { UpdateStaffDto, UpdateStaffResponseDto } from "./dto/update-staff.dto";
import { FindAllStaffResponseDto } from "./dto/find-all-staff.dto";
import { FindOneStaffResponseDto } from "./dto/find-one-staff.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("staff")
@ApiTags("Staff")
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

  @ApiResponse({
    status: 201,
    description: "Staff created successfully",
    type: CreateStaffResponseDto,
  })
  @ApiResponse({ status: 409, description: "Email or phone already exists" })
  @ApiResponse({ status: 404, description: "Role or Department not found" })
  @Roles("ADMIN")
  @Post()
  async create(@Body() dto: CreateStaffDto): Promise<CreateStaffResponseDto> {
    return await this.staffService.create(dto);
  }

  @ApiResponse({
    status: 200,
    description: "Staff updated successfully",
    type: UpdateStaffResponseDto,
  })
  @ApiResponse({ status: 404, description: "Staff not found" })
  @ApiResponse({ status: 409, description: "Phone already exists" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<UpdateStaffResponseDto> {
    return await this.staffService.update(id, dto, user);
  }

  @ApiResponse({
    status: 200,
    description: "Staff deleted successfully",
    schema: { example: { message: "Staff deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Staff not found" })
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    return await this.staffService.remove(id);
  }
}
