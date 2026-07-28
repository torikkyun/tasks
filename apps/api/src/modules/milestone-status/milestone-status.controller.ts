import { Controller, Get } from "@nestjs/common";
import { MilestoneStatusService } from "./milestone-status.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllMilestoneStatusResponseDto } from "./dto/find-all-milestone-status.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Milestone Statuses")
@Controller("milestone-statuses")
export class MilestoneStatusController {
  constructor(
    private readonly milestoneStatusService: MilestoneStatusService,
  ) {}

  @ApiResponse({
    status: 200,
    description: "Milestone statuses retrieved successfully",
    type: FindAllMilestoneStatusResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllMilestoneStatusResponseDto> {
    return await this.milestoneStatusService.findAll();
  }
}
