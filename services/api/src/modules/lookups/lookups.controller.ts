import { Controller, Get } from "@nestjs/common";
import { LookupsService } from "./lookups.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllLookupsResponseDto } from "./dto/find-all-lookups.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lookups")
@Controller("lookups")
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @ApiResponse({
    status: 200,
    description: "Lấy dữ liệu thành công",
    type: FindAllLookupsResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllLookupsResponseDto> {
    return await this.lookupsService.findAll();
  }
}
