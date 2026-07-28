import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllPhaseStatusResponseDto } from "./dto/find-all-phase-status.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class PhaseStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllPhaseStatusResponseDto> {
    const phaseStatuses = await this.prisma.phaseStatus.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllPhaseStatusResponseDto, { phaseStatuses });
  }
}
