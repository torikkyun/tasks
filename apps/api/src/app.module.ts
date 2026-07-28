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
import { ProjectStatusModule } from "./modules/project-status/project-status.module";
import { TaskStatusModule } from "./modules/task-status/task-status.module";
import { TaskPriorityModule } from "./modules/task-priority/task-priority.module";
import { PhaseStatusModule } from "./modules/phase-status/phase-status.module";
import { MilestoneStatusModule } from "./modules/milestone-status/milestone-status.module";
import { MemberRoleModule } from "./modules/member-role/member-role.module";

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
    RoleModule,
    DepartmentModule,
    ProjectStatusModule,
    TaskStatusModule,
    TaskPriorityModule,
    PhaseStatusModule,
    MilestoneStatusModule,
    MemberRoleModule,
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
