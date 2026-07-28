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
import { ChangePasswordDto } from "./dto/change-password.dto";

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

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const staff = await this.validateUser(email, password);
    return toDto(LoginResponseDto, {
      accessToken: await this.jwtService.signAsync({
        id: staff.id,
        email: staff.email,
        role: staff.role.code,
      }),
      staff,
    });
  }

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { email, phone, password, name } = dto;
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
        email,
        phone,
        name,
        passwordHash: hashPassword(password),
        avatarUrl: `https://api.dicebear.com/10.x/identicon/svg?seed=${encodeURIComponent(email)}&background=%23ffffff`,
        role: { connect: { code: "USER" } },
        department: { connect: { code: "IT" } },
      },
      include: { role: true, department: true },
    });

    return toDto(RegisterResponseDto, {
      accessToken: await this.jwtService.signAsync({
        id: staff.id,
        email: staff.email,
        role: staff.role.code,
      }),
      staff,
    });
  }

  async changePassword(
    user: { id: string; email: string },
    { oldPassword, newPassword }: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const staff = await this.prisma.staff.findUnique({
      where: { id: user.id },
    });

    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    const isPasswordValid = comparePassword(oldPassword, staff.passwordHash);
    if (!isPasswordValid) {
      throw new ConflictException("Invalid old password");
    }

    const newPasswordHash = hashPassword(newPassword);
    await this.prisma.staff.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return { message: "Password changed successfully" };
  }
}
