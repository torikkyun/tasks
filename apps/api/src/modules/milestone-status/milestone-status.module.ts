import { Module } from "@nestjs/common";
import { MilestoneStatusController } from "./milestone-status.controller";
import { MilestoneStatusService } from "./milestone-status.service";

@Module({
  controllers: [MilestoneStatusController],
  providers: [MilestoneStatusService],
})
export class MilestoneStatusModule {}

