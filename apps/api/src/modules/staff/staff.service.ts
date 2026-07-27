import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";

@Injectable()
export class StaffService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    const staff = await this.prismaService.staff.findFirst({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff not found`);
    }

    return staff;
  }
}
