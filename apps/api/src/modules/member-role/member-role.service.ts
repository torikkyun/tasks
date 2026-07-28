import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { FindAllResponseDto } from "./dto/find-all-member-role.dto";
import { toDto } from "@/common/helpers/to-dto.helper";

@Injectable()
export class MemberRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FindAllResponseDto> {
    const memberRoles = await this.prisma.memberRole.findMany({
      orderBy: { name: "asc" },
    });

    return toDto(FindAllResponseDto, { memberRoles });
  }
}
