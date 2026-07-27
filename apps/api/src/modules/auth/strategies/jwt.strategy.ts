import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "@/infrastructure/database/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("auth.jwtSecret")!,
    });
  }

  async validate(payload: { id: string; email: string; role: string }) {
    const staff = await this.prisma.staff.findFirst({
      where: { id: payload.id },
      include: { role: true, department: true },
    });

    if (!staff) {
      return null;
    }

    const { passwordHash: _passwordHash, ...safeStaff } = staff;
    return safeStaff;
  }
}
