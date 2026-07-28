import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllMilestoneStatusResponseDto } from "./dto/find-all-milestone-status.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class MilestoneStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllMilestoneStatusResponseDto> {
    const milestoneStatuses = await this.prisma.milestoneStatus.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllMilestoneStatusResponseDto, { milestoneStatuses });
  }
}
