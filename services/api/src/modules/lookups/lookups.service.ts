import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { toDto } from "@/common/helpers/to-dto.helper";
import { FindAllLookupsResponseDto } from "./dto/find-all-lookups.dto";

@Injectable()
export class LookupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllLookupsResponseDto> {
    const [
      roles,
      departments,
      projectStatuses,
      taskStatuses,
      taskPriorities,
      phaseStatuses,
      milestoneStatuses,
      memberRoles,
    ] = await Promise.all([
      this.prisma.role.findMany({ orderBy: { name: "asc" } }),
      this.prisma.department.findMany({ orderBy: { name: "asc" } }),
      this.prisma.projectStatus.findMany({ orderBy: { name: "asc" } }),
      this.prisma.taskStatus.findMany({ orderBy: { name: "asc" } }),
      this.prisma.taskPriority.findMany({ orderBy: { name: "asc" } }),
      this.prisma.phaseStatus.findMany({ orderBy: { name: "asc" } }),
      this.prisma.milestoneStatus.findMany({ orderBy: { name: "asc" } }),
      this.prisma.memberRole.findMany({ orderBy: { name: "asc" } }),
    ]);

    return toDto(FindAllLookupsResponseDto, {
      roles,
      departments,
      projectStatuses,
      taskStatuses,
      taskPriorities,
      phaseStatuses,
      milestoneStatuses,
      memberRoles,
    });
  }
}
