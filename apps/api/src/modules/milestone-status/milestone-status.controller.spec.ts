import { Test, TestingModule } from "@nestjs/testing";
import { MilestoneStatusController } from "./milestone-status.controller";
import { MilestoneStatusService } from "./milestone-status.service";

describe("MilestoneStatusController", () => {
  let controller: MilestoneStatusController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilestoneStatusController],
      providers: [{ provide: MilestoneStatusService, useValue: service }],
    }).compile();

    controller = module.get<MilestoneStatusController>(
      MilestoneStatusController,
    );
  });

  it("should return milestone statuses from service", async () => {
    const expected = {
      data: [
        { id: "1", name: "On Track", code: "ON_TRACK", description: null },
      ],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});

