import { Controller, Get } from "@nestjs/common";
import { PhaseStatusService } from "./phase-status.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllPhaseStatusResponseDto } from "./dto/find-all-phase-status.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Phase Statuses")
@Controller("phase-statuses")
export class PhaseStatusController {
  constructor(private readonly phaseStatusService: PhaseStatusService) {}

  @ApiResponse({
    status: 200,
    description: "Phase statuses retrieved successfully",
    type: FindAllPhaseStatusResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllPhaseStatusResponseDto> {
    return await this.phaseStatusService.findAll();
  }
}
