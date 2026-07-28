import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { QueryStaffDto } from "./dto/query-staff.dto";
import { CreateStaffDto, CreateStaffResponseDto } from "./dto/create-staff.dto";
import { UpdateStaffDto, UpdateStaffResponseDto } from "./dto/update-staff.dto";
import { FindAllStaffResponseDto } from "./dto/find-all-staff.dto";
import { FindOneStaffResponseDto } from "./dto/find-one-staff.dto";
import { toDto } from "@/common/helpers/to-dto.helper";
import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/common/utils/hash.util";
import { InMemoryCacheService } from "@/infrastructure/cache/in-memory-cache.service";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: InMemoryCacheService,
  ) {}

  async findAll(query: QueryStaffDto): Promise<FindAllStaffResponseDto> {
    const cacheKey = this.cacheService.buildListKey("staff", query);
    const cached =
      await this.cacheService.get<FindAllStaffResponseDto>(cacheKey);
    if (cached) return cached;

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

    const total = await this.prisma.staff.count({ where });

    const staff = await this.prisma.staff.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        role: true,
        department: true,
      },
    });

    const result = toDto(FindAllStaffResponseDto, {
      staff,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });

    await this.cacheService.setList("staff", cacheKey, result);

    return result;
  }

  async findOne(id: string): Promise<FindOneStaffResponseDto> {
    const cacheKey = this.cacheService.buildKey("staff", id);
    const cached =
      await this.cacheService.get<FindOneStaffResponseDto>(cacheKey);
    if (cached) return cached;

    const staff = await this.prisma.staff.findFirst({
      where: { id, deletedAt: null },
      include: {
        role: true,
        department: true,
      },
    });

    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    const result = toDto(FindOneStaffResponseDto, { staff });
    await this.cacheService.set(cacheKey, result);

    return result;
  }

  async create(dto: CreateStaffDto): Promise<CreateStaffResponseDto> {
    const { name, email, phone, password, roleId, departmentId } = dto;
    const existingStaff = await this.prisma.staff.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingStaff) {
      throw new ConflictException("Email or phone already exists");
    }

    try {
      const staff = await this.prisma.staff.create({
        data: {
          name,
          email,
          phone,
          passwordHash: hashPassword(password),
          avatarUrl: `https://api.dicebear.com/10.x/identicon/svg?seed=${encodeURIComponent(email)}&background=%23ffffff`,
          role: {
            connect: { id: roleId },
          },
          department: {
            connect: { id: departmentId },
          },
        },
        include: {
          role: true,
          department: true,
        },
      });

      await this.cacheService.clearNamespace("staff");

      return toDto(CreateStaffResponseDto, { staff });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Role or department not found");
      }
      throw e;
    }
  }

  async update(
    id: string,
    dto: UpdateStaffDto,
    user: { id: string; role: { code: string } },
  ): Promise<UpdateStaffResponseDto> {
    const { name, phone, roleId, departmentId } = dto;
    const staff = await this.prisma.staff.findFirst({
      where: { id, deletedAt: null },
      include: {
        role: true,
        department: true,
      },
    });

    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    const isAdmin = user.role.code === "ADMIN";
    const isSelf = user.id === staff.id;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException("Forbidden");
    }

    const updateData: Prisma.StaffUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (phone !== undefined) {
      const existingPhone = await this.prisma.staff.findFirst({
        where: {
          phone,
          id: { not: id },
        },
      });

      if (existingPhone) {
        throw new ConflictException("Phone already exists");
      }

      updateData.phone = phone;
    }

    if (roleId !== undefined) {
      if (!isAdmin) {
        throw new ForbiddenException("Forbidden");
      }

      updateData.role = { connect: { id: roleId } };
    }

    if (departmentId !== undefined) {
      if (!isAdmin) {
        throw new ForbiddenException("Forbidden");
      }

      updateData.department = { connect: { id: departmentId } };
    }

    try {
      const updatedStaff = await this.prisma.staff.update({
        where: { id },
        data: updateData,
        include: {
          role: true,
          department: true,
        },
      });

      await Promise.all([
        this.cacheService.del(this.cacheService.buildKey("staff", id)),
        this.cacheService.clearNamespace("staff"),
      ]);

      return toDto(UpdateStaffResponseDto, { staff: updatedStaff });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Role or department not found");
      }
      throw e;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.staff.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await Promise.all([
        this.cacheService.del(this.cacheService.buildKey("staff", id)),
        this.cacheService.clearNamespace("staff"),
      ]);

      return { message: "Staff deleted successfully" };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        throw new NotFoundException("Staff not found");
      }
      throw e;
    }
  }
}
