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
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { ProjectMilestoneService } from "../service/project-milestone.service";
import {
  CreateProjectMilestoneDto,
  CreateProjectMilestoneResponseDto,
} from "../dto/milestone/create-milestone.dto";
import { FindAllProjectMilestonesResponseDto } from "../dto/milestone/find-all-project-milestones.dto";
import { FindOneProjectMilestoneResponseDto } from "../dto/milestone/find-one-project-milestone.dto";
import {
  UpdateProjectMilestoneDto,
  UpdateProjectMilestoneResponseDto,
} from "../dto/milestone/update-milestone.dto";

@Controller("projects/:projectId/milestones")
@ApiTags("Project Milestones")
@ApiBearerAuth()
export class ProjectMilestoneController {
  constructor(
    private readonly projectMilestoneService: ProjectMilestoneService,
  ) {}

  @ApiResponse({
    status: 200,
    description: "Project milestones retrieved successfully",
    type: FindAllProjectMilestonesResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get()
  async findMilestones(
    @Param("projectId") projectId: string,
    @Query("phaseId") phaseId?: string,
  ): Promise<FindAllProjectMilestonesResponseDto> {
    return await this.projectMilestoneService.findMilestones(
      projectId,
      phaseId,
    );
  }

  @ApiResponse({
    status: 200,
    description: "Project milestone retrieved successfully",
    type: FindOneProjectMilestoneResponseDto,
  })
  @ApiResponse({ status: 404, description: "Milestone not found" })
  @Get(":milestoneId")
  async findMilestone(
    @Param("projectId") projectId: string,
    @Param("milestoneId") milestoneId: string,
  ): Promise<FindOneProjectMilestoneResponseDto> {
    return await this.projectMilestoneService.findMilestone(
      projectId,
      milestoneId,
    );
  }

  @ApiResponse({
    status: 201,
    description: "Project milestone created successfully",
    type: CreateProjectMilestoneResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @ApiResponse({ status: 404, description: "Phase not found" })
  @ApiResponse({ status: 404, description: "MilestoneStatus not found" })
  @Roles("ADMIN", "MANAGER")
  @Post()
  async createMilestone(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectMilestoneDto,
  ): Promise<CreateProjectMilestoneResponseDto> {
    return await this.projectMilestoneService.createMilestone(projectId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project milestone updated successfully",
    type: UpdateProjectMilestoneResponseDto,
  })
  @ApiResponse({ status: 404, description: "Milestone not found" })
  @Roles("ADMIN", "MANAGER")
  @Patch(":milestoneId")
  async updateMilestone(
    @Param("projectId") projectId: string,
    @Param("milestoneId") milestoneId: string,
    @Body() dto: UpdateProjectMilestoneDto,
  ): Promise<UpdateProjectMilestoneResponseDto> {
    return await this.projectMilestoneService.updateMilestone(
      projectId,
      milestoneId,
      dto,
    );
  }

  @ApiResponse({
    status: 200,
    description: "Project milestone deleted successfully",
    schema: { example: { message: "Milestone deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Milestone not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete(":milestoneId")
  async removeMilestone(
    @Param("projectId") projectId: string,
    @Param("milestoneId") milestoneId: string,
  ): Promise<{ message: string }> {
    return await this.projectMilestoneService.removeMilestone(
      projectId,
      milestoneId,
    );
  }
}
