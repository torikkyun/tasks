import { Module } from "@nestjs/common";
import { ProjectController } from "./controller/project.controller";
import { ProjectMemberController } from "./controller/project-member.controller";
import { ProjectPhaseController } from "./controller/project-phase.controller";
import { ProjectService } from "./service/project.service";
import { ProjectMemberService } from "./service/project-member.service";
import { ProjectPhaseService } from "./service/project-phase.service";

@Module({
  controllers: [
    ProjectController,
    ProjectMemberController,
    ProjectPhaseController,
  ],
  providers: [ProjectService, ProjectMemberService, ProjectPhaseService],
})
export class ProjectModule {}
