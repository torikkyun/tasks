import { Controller, Get } from "@nestjs/common";
import { RoleService } from "./role.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllRoleResponseDto } from "./dto/find-all-role.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("roles")
@ApiTags("Roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiResponse({
    status: 200,
    description: "Roles retrieved successfully",
    type: FindAllRoleResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllRoleResponseDto> {
    return await this.roleService.findAll();
  }
}
