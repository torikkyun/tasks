import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { ProjectPhaseService } from "../service/project-phase.service";
import {
  CreateProjectPhaseDto,
  CreateProjectPhaseResponseDto,
} from "../dto/phase/create-phase.dto";
import { FindAllProjectPhasesResponseDto } from "../dto/phase/find-all-project-phases.dto";
import { FindOneProjectPhaseResponseDto } from "../dto/phase/find-one-project-phase.dto";
import {
  UpdateProjectPhaseDto,
  UpdateProjectPhaseResponseDto,
} from "../dto/phase/update-phase.dto";

@Controller("projects/:projectId/phases")
@ApiTags("Project Phases")
@ApiBearerAuth()
export class ProjectPhaseController {
  constructor(private readonly projectPhaseService: ProjectPhaseService) {}

  @ApiResponse({
    status: 200,
    description: "Project phases retrieved successfully",
    type: FindAllProjectPhasesResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get()
  async findPhases(
    @Param("projectId") projectId: string,
  ): Promise<FindAllProjectPhasesResponseDto> {
    return await this.projectPhaseService.findPhases(projectId);
  }

  @ApiResponse({
    status: 200,
    description: "Project phase retrieved successfully",
    type: FindOneProjectPhaseResponseDto,
  })
  @ApiResponse({ status: 404, description: "Phase not found" })
  @Get(":phaseId")
  async findPhase(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
  ): Promise<FindOneProjectPhaseResponseDto> {
    return await this.projectPhaseService.findPhase(projectId, phaseId);
  }

  @ApiResponse({
    status: 201,
    description: "Project phase created successfully",
    type: CreateProjectPhaseResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @ApiResponse({ status: 404, description: "PhaseStatus not found" })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @Roles("ADMIN", "MANAGER")
  @Post()
  async createPhase(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectPhaseDto,
  ): Promise<CreateProjectPhaseResponseDto> {
    return await this.projectPhaseService.createPhase(projectId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project phase updated successfully",
    type: UpdateProjectPhaseResponseDto,
  })
  @ApiResponse({ status: 404, description: "Phase not found" })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @Roles("ADMIN", "MANAGER")
  @Patch(":phaseId")
  async updatePhase(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Body() dto: UpdateProjectPhaseDto,
  ): Promise<UpdateProjectPhaseResponseDto> {
    return await this.projectPhaseService.updatePhase(projectId, phaseId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project phase deleted successfully",
    schema: { example: { message: "Phase deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Phase not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete(":phaseId")
  async removePhase(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
  ): Promise<{ message: string }> {
    return await this.projectPhaseService.removePhase(projectId, phaseId);
  }
}
