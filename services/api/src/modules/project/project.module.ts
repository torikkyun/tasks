import { Module } from "@nestjs/common";
import { ProjectController } from "./controller/project.controller";
import { ProjectMemberController } from "./controller/project-member.controller";
import { ProjectAttachmentController } from "./controller/project-attachment.controller";
import { ProjectMilestoneController } from "./controller/project-milestone.controller";
import { ProjectPhaseController } from "./controller/project-phase.controller";
import { ProjectService } from "./service/project.service";
import { ProjectMemberService } from "./service/project-member.service";
import { ProjectMilestoneService } from "./service/project-milestone.service";
import { ProjectPhaseService } from "./service/project-phase.service";

@Module({
  controllers: [
    ProjectController,
    ProjectMemberController,
    ProjectAttachmentController,
    ProjectMilestoneController,
    ProjectPhaseController,
  ],
  providers: [
    ProjectService,
    ProjectMemberService,
    ProjectMilestoneService,
    ProjectPhaseService,
  ],
})
export class ProjectModule {}
