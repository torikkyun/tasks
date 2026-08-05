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
import { RolesGuard } from "./common/guards/roles.guard";
import { RoleModule } from "./modules/role/role.module";
import { DepartmentModule } from "./modules/department/department.module";
import { ProjectModule } from "./modules/project/project.module";
import { TaskModule } from "./modules/task/task.module";
import { InMemoryCacheModule } from "./infrastructure/cache/in-memory-cache.module";
import { LookupsModule } from "./modules/lookups/lookups.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
      load: [appConfig, databaseConfig, authConfig],
    }),
    InMemoryCacheModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    StaffModule,
    RoleModule,
    DepartmentModule,
    ProjectModule,
    TaskModule,
    LookupsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
