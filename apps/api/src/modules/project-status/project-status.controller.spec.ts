import { Test, TestingModule } from "@nestjs/testing";
import { ProjectStatusController } from "./project-status.controller";
import { ProjectStatusService } from "./project-status.service";

describe("ProjectStatusController", () => {
  let controller: ProjectStatusController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectStatusController],
      providers: [{ provide: ProjectStatusService, useValue: service }],
    }).compile();

    controller = module.get<ProjectStatusController>(
      ProjectStatusController,
    );
  });

  it("should return project statuses from service", async () => {
    const expected = {
      data: [{ id: "1", name: "Active", code: "ACTIVE", description: null }],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});

