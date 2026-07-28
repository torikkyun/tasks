import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { QueryStaffDto } from "./dto/query-staff.dto";
import { FindAllStaffResponseDto } from "./dto/find-all-staff.dto";
import { FindOneStaffResponseDto } from "./dto/find-one-staff.dto";
import { toDto } from "@/common/helpers/to-dto.helper";
import { Prisma } from "@/generated/prisma/client";

@Injectable()
export class StaffService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: QueryStaffDto): Promise<FindAllStaffResponseDto> {
    const { page = 1, limit = 10, search, roleId, departmentId } = query;

    const where: Prisma.StaffWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roleId) {
      where.roleId = roleId;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const total = await this.prismaService.staff.count({ where });

    const staffs = await this.prismaService.staff.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        role: true,
        department: true,
      },
    });

    return toDto(FindAllStaffResponseDto, {
      staffs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  }

  async findOne(id: string): Promise<FindOneStaffResponseDto> {
    const staff = await this.prismaService.staff.findFirst({
      where: { id, deletedAt: null },
      include: {
        role: true,
        department: true,
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff not found`);
    }

    return toDto(FindOneStaffResponseDto, { staff });
  }
}
