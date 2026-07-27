import { PrismaService } from "@/infrastructure/database/prisma.service";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { comparePassword, hashPassword } from "@/common/utils/hash.util";
import { toDto } from "@/common/helpers/to-dto.helper";
import { RegisterResponseDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { email },
      include: { role: true, department: true },
    });

    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    const isPasswordValid = comparePassword(password, staff.passwordHash);
    if (!isPasswordValid) {
      throw new ConflictException("Invalid password");
    }

    return staff;
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const staff = await this.validateUser(dto.email, dto.password);
    return toDto(LoginResponseDto, {
      accessToken: await this.jwtService.signAsync({
        id: staff.id,
        email: staff.email,
        role: staff.role.roleCode,
      }),
      staff,
    });
  }

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { email, phone, password } = dto;
    const existingStaff = await this.prisma.staff.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingStaff) {
      throw new ConflictException("Staff already exists");
    }

    const staff = await this.prisma.staff.create({
      data: {
        ...dto,
        passwordHash: hashPassword(password),
        avatarUrl: `https://api.dicebear.com/10.x/identicon/svg?seed=${encodeURIComponent(email)}&background=%23ffffff`,
        role: { connect: { roleCode: "USER" } },
        department: { connect: { departmentCode: "IT" } },
      },
      include: { role: true, department: true },
    });

    return toDto(LoginResponseDto, {
      accessToken: await this.jwtService.signAsync({
        id: staff.id,
        email: staff.email,
        role: staff.role.roleCode,
      }),
      staff,
    });
  }
}
