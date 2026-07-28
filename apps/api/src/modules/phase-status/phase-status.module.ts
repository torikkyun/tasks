import { Module } from "@nestjs/common";
import { PhaseStatusController } from "./phase-status.controller";
import { PhaseStatusService } from "./phase-status.service";

@Module({
  controllers: [PhaseStatusController],
  providers: [PhaseStatusService],
})
export class PhaseStatusModule {}

