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
import { ProjectService } from "../service/project.service";
import {
  FindAllProjectsResponseDto,
  QueryProjectDto,
} from "../dto/project/query-project.dto";
import {
  CreateProjectDto,
  CreateProjectResponseDto,
} from "../dto/project/create-project.dto";
import {
  UpdateProjectDto,
  UpdateProjectResponseDto,
} from "../dto/project/update-project.dto";
import { FindOneProjectResponseDto } from "../dto/project/find-one-project.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { FindProjectGanttQueryDto } from "../dto/gantt/find-project-gantt-query.dto";
import { FindProjectGanttResponseDto } from "../dto/gantt/find-project-gantt.dto";

@Controller("projects")
@ApiTags("Projects")
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({
    status: 200,
    description: "Projects list retrieved successfully",
    type: FindAllProjectsResponseDto,
  })
  @Get()
  async findAll(
    @Query() query: QueryProjectDto,
  ): Promise<FindAllProjectsResponseDto> {
    return await this.projectService.findAll(query);
  }

  @ApiResponse({
    status: 200,
    description: "Project retrieved successfully",
    type: FindOneProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<FindOneProjectResponseDto> {
    return await this.projectService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: "Project gantt data retrieved successfully",
    type: FindProjectGanttResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get(":projectId/gantt")
  async findGantt(
    @Param("projectId") projectId: string,
    @Query() query: FindProjectGanttQueryDto,
  ): Promise<FindProjectGanttResponseDto> {
    return await this.projectService.findGantt(projectId, query);
  }

  @ApiResponse({
    status: 201,
    description: "Project created successfully",
    type: CreateProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @ApiResponse({ status: 404, description: "ProjectStatus not found" })
  @Roles("ADMIN", "MANAGER")
  @Post()
  async create(
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectResponseDto> {
    return await this.projectService.create(dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project updated successfully",
    type: UpdateProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: "endDate phải sau startDate" })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Roles("ADMIN", "MANAGER")
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<UpdateProjectResponseDto> {
    return await this.projectService.update(id, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project deleted successfully",
    schema: { example: { message: "Project deleted successfully" } },
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    return await this.projectService.remove(id);
  }
}
