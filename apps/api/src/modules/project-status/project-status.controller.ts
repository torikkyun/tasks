import { Controller, Get } from "@nestjs/common";
import { ProjectStatusService } from "./project-status.service";
import { Public } from "@/common/decorators/public.decorator";
import { FindAllProjectStatusResponseDto } from "./dto/find-all-project-status.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Project Statuses")
@Controller("project-statuses")
export class ProjectStatusController {
  constructor(private readonly projectStatusService: ProjectStatusService) {}

  @ApiResponse({
    status: 200,
    description: "Project statuses retrieved successfully",
    type: FindAllProjectStatusResponseDto,
  })
  @Public()
  @Get()
  async findAll(): Promise<FindAllProjectStatusResponseDto> {
    return await this.projectStatusService.findAll();
  }
}
