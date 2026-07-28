import { Test, TestingModule } from "@nestjs/testing";
import { PhaseStatusController } from "./phase-status.controller";
import { PhaseStatusService } from "./phase-status.service";

describe("PhaseStatusController", () => {
  let controller: PhaseStatusController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhaseStatusController],
      providers: [{ provide: PhaseStatusService, useValue: service }],
    }).compile();

    controller = module.get<PhaseStatusController>(PhaseStatusController);
  });

  it("should return phase statuses from service", async () => {
    const expected = {
      data: [
        {
          id: "1",
          name: "Not Started",
          code: "NOT_STARTED",
          description: null,
        },
      ],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});

