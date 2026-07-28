import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllDepartmentResponseDto } from "./dto/find-all-department.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllDepartmentResponseDto> {
    const departments = await this.prisma.department.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllDepartmentResponseDto, { departments });
  }
}
