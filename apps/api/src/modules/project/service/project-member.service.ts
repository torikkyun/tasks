import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client";
import { toDto } from "@/common/helpers/to-dto.helper";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import {
  CreateProjectMemberDto,
  CreateProjectMemberResponseDto,
} from "../dto/project-member/create-project-member.dto";
import { FindAllProjectMembersResponseDto } from "../dto/project-member/find-all-project-member.dto";
import {
  UpdateProjectMemberDto,
  UpdateProjectMemberResponseDto,
} from "../dto/project-member/update-project-member.dto";

@Injectable()
export class ProjectMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async findMembers(
    projectId: string,
  ): Promise<FindAllProjectMembersResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });

    if (!project) throw new NotFoundException("Project not found");

    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: { member: { include: { department: true } }, memberRole: true },
      orderBy: { joinedAt: "asc" },
    });

    return toDto(FindAllProjectMembersResponseDto, { members });
  }

  async addMember(
    projectId: string,
    dto: CreateProjectMemberDto,
  ): Promise<CreateProjectMemberResponseDto> {
    const { memberId, memberRoleId, joinedAt, leftAt } = dto;
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const existingMember = await this.prisma.projectMember.findUnique({
      where: { projectId_memberId: { projectId, memberId } },
    });
    if (existingMember)
      throw new ConflictException("Staff đã là thành viên của dự án");

    const member = await this.prisma.staff.findUnique({
      where: { id: memberId },
      select: { id: true },
    });
    if (!member) throw new NotFoundException("Staff not found");

    const memberRole = await this.prisma.memberRole.findUnique({
      where: { id: memberRoleId },
      select: { id: true },
    });
    if (!memberRole) throw new NotFoundException("MemberRole not found");

    const projectMember = await this.prisma.projectMember.create({
      data: {
        joinedAt: new Date(joinedAt),
        leftAt: leftAt ? new Date(leftAt) : null,
        member: { connect: { id: memberId } },
        project: { connect: { id: projectId } },
        memberRole: { connect: { id: memberRoleId } },
      },
      include: { member: { include: { department: true } }, memberRole: true },
    });

    return toDto(CreateProjectMemberResponseDto, { member: projectMember });
  }

  async updateMember(
    projectId: string,
    memberId: string,
    dto: UpdateProjectMemberDto,
  ): Promise<UpdateProjectMemberResponseDto> {
    const { memberRoleId, joinedAt, leftAt } = dto;
    const projectMember = await this.prisma.projectMember.findFirst({
      where: { memberId, projectId },
      include: { member: { include: { department: true } }, memberRole: true },
    });
    if (!projectMember) throw new NotFoundException("Member not found");

    const updateData: Prisma.ProjectMemberUpdateInput = {};
    if (memberRoleId !== undefined)
      updateData.memberRole = { connect: { id: memberRoleId } };
    if (joinedAt !== undefined) updateData.joinedAt = new Date(joinedAt);
    if (leftAt !== undefined)
      updateData.leftAt = leftAt ? new Date(leftAt) : null;

    try {
      const updatedMember = await this.prisma.projectMember.update({
        where: { id: memberId },
        data: updateData,
        include: {
          member: { include: { department: true } },
          memberRole: true,
        },
      });
      return toDto(UpdateProjectMemberResponseDto, { member: updatedMember });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      )
        throw new NotFoundException("Member not found");
      throw e;
    }
  }

  async removeMember(
    projectId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const deleted = await this.prisma.projectMember.deleteMany({
      where: { id: memberId, projectId },
    });
    if (deleted.count === 0)
      throw new NotFoundException("ProjectMember not found");
    return { message: "Member removed successfully" };
  }
}
