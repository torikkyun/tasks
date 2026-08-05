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
import { ProjectMemberService } from "../service/project-member.service";
import {
  CreateProjectMemberDto,
  CreateProjectMemberResponseDto,
} from "../dto/project-member/create-project-member.dto";
import { FindAllProjectMembersResponseDto } from "../dto/project-member/find-all-project-member.dto";
import {
  UpdateProjectMemberDto,
  UpdateProjectMemberResponseDto,
} from "../dto/project-member/update-project-member.dto";

@Controller("projects/:projectId/members")
@ApiTags("Project Members")
@ApiBearerAuth()
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @ApiResponse({
    status: 200,
    description: "Project members retrieved successfully",
    type: FindAllProjectMembersResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @Get()
  async findMembers(
    @Param("projectId") projectId: string,
  ): Promise<FindAllProjectMembersResponseDto> {
    return await this.projectMemberService.findMembers(projectId);
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
  @Post()
  async addMember(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectMemberDto,
  ): Promise<CreateProjectMemberResponseDto> {
    return await this.projectMemberService.addMember(projectId, dto);
  }

  @ApiResponse({
    status: 200,
    description: "Project member updated successfully",
    type: UpdateProjectMemberResponseDto,
  })
  @ApiResponse({ status: 404, description: "ProjectMember not found" })
  @Roles("ADMIN", "MANAGER")
  @Patch(":memberId")
  async updateMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateProjectMemberDto,
  ): Promise<UpdateProjectMemberResponseDto> {
    return await this.projectMemberService.updateMember(
      projectId,
      memberId,
      dto,
    );
  }

  @ApiResponse({
    status: 200,
    description: "Project member removed successfully",
    schema: { example: { message: "Member removed successfully" } },
  })
  @ApiResponse({ status: 404, description: "ProjectMember not found" })
  @Roles("ADMIN", "MANAGER")
  @Delete(":memberId")
  async removeMember(
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
  ): Promise<{ message: string }> {
    return await this.projectMemberService.removeMember(projectId, memberId);
  }
}
