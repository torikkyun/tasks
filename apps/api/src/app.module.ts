import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./configs/app.config";
import databaseConfig from "./configs/database.config";
import authConfig from "./configs/auth.config";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { StaffModule } from "./modules/staff/staff.module";
import { HealthModule } from "./health/health.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./modules/auth/guards/jwt.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
      load: [appConfig, databaseConfig, authConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    StaffModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
