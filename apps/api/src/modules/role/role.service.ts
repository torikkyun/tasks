import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { toDto } from "@/common/helpers/to-dto.helper";
import { FindAllRoleResponseDto } from "./dto/find-all-role.dto";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllRoleResponseDto> {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllRoleResponseDto, { roles });
  }
}
