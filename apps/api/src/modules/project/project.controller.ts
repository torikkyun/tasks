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
import { ProjectService } from "./project.service";
import {
  FindAllProjectsResponseDto,
  QueryProjectDto,
} from "./dto/query-project.dto";
import {
  CreateProjectDto,
  CreateProjectResponseDto,
} from "./dto/create-project.dto";
import {
  UpdateProjectDto,
  UpdateProjectResponseDto,
} from "./dto/update-project.dto";
import { FindOneProjectResponseDto } from "./dto/find-one-project.dto";
import {
  CreateProjectMemberDto,
  CreateProjectMemberResponseDto,
} from "./dto/create-project-member.dto";
import {
  UpdateProjectMemberDto,
  UpdateProjectMemberResponseDto,
} from "./dto/update-project-member.dto";
import { FindAllProjectMembersResponseDto } from "./dto/find-all-project-member.dto";

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
    description: "Project members retrieved successfully",
    type: FindAllProjectMembersResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get(":projectId/members")
  async findMembers(
    @Param("projectId") projectId: string,
  ): Promise<FindAllProjectMembersResponseDto> {
    return await this.projectService.findMembers(projectId);
  }

  @ApiResponse({
    status: 201,
    description: "Project member added successfully",
    type: CreateProjectMemberResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @ApiResponse({ status: 404, description: "Staff not found" })
  @ApiResponse({ status: 404, description: "MemberRole not found" })
  @ApiResponse({ status: 409, description: "Staff đã là thành viên của dự án" })
  @Roles("ADMIN", "MANAGER")
  @Post(":projectId/members")
  async addMember(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectMemberDto,
  ): Promise<CreateProjectMemberResponseDto> {
    return await this.projectService.addMember(projectId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project member updated successfully",
    type: UpdateProjectMemberResponseDto,
  })
  @ApiResponse({ status: 404, description: "ProjectMember not found" })
  @Roles("ADMIN", "MANAGER")
  @Patch(":projectId/members/:memberId")
  async updateMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateProjectMemberDto,
  ): Promise<UpdateProjectMemberResponseDto> {
    return await this.projectService.updateMember(projectId, memberId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project member removed successfully",
    schema: { example: { message: "Member removed successfully" } },
  })
  @ApiResponse({ status: 404, description: "ProjectMember not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete(":projectId/members/:memberId")
  async removeMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
  ): Promise<{ message: string }> {
    return await this.projectService.removeMember(projectId, memberId);
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
