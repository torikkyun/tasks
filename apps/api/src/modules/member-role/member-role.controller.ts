import { Controller, Get } from "@nestjs/common";
import { MemberRoleService } from "./member-role.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllResponseDto } from "./dto/find-all-member-role.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Member Roles")
@Controller("member-roles")
export class MemberRoleController {
  constructor(private readonly memberRoleService: MemberRoleService) {}

  @ApiResponse({
    status: 200,
    description: "Member roles retrieved successfully",
    type: FindAllResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllResponseDto> {
    return await this.memberRoleService.findAll();
  }
}
