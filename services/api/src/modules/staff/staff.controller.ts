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
import { FindAllStaffResponseDto, QueryStaffDto } from "./dto/query-staff.dto";
import { CreateStaffDto, CreateStaffResponseDto } from "./dto/create-staff.dto";
import { UpdateStaffDto, UpdateStaffResponseDto } from "./dto/update-staff.dto";
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
    description: "Danh sách nhân viên được lấy thành công",
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
    description: "Nhân viên được lấy thành công",
    type: FindOneStaffResponseDto,
  })
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<FindOneStaffResponseDto> {
    return await this.staffService.findOne(id);
  }

  @ApiResponse({
    status: 201,
    description: "Tạo nhân viên thành công",
    type: CreateStaffResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Email hoặc số điện thoại đã có người sử dụng",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy vai trò hoặc phòng ban",
  })
  @Roles("ADMIN")
  @Post()
  async create(@Body() dto: CreateStaffDto): Promise<CreateStaffResponseDto> {
    return await this.staffService.create(dto);
  }

  @ApiResponse({
    status: 200,
    description: "Cập nhật nhân viên thành công",
    type: UpdateStaffResponseDto,
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy nhân viên" })
  @ApiResponse({
    status: 409,
    description: "Số điện thoại đã có người sử dụng",
  })
  @ApiResponse({ status: 403, description: "Không có quyền" })
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
    description: "Xóa nhân viên thành công",
    schema: { example: { message: "Xóa nhân viên thành công" } },
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy nhân viên" })
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    return await this.staffService.remove(id);
  }
}
