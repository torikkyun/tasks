import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllProjectStatusResponseDto } from "./dto/find-all-project-status.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class ProjectStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllProjectStatusResponseDto> {
    const projectStatuses = await this.prisma.projectStatus.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllProjectStatusResponseDto, { projectStatuses });
  }
}
