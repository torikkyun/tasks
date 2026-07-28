import { Test, TestingModule } from "@nestjs/testing";
import { TaskStatusController } from "./task-status.controller";
import { TaskStatusService } from "./task-status.service";

describe("TaskStatusController", () => {
  let controller: TaskStatusController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStatusController],
      providers: [{ provide: TaskStatusService, useValue: service }],
    }).compile();

    controller = module.get<TaskStatusController>(TaskStatusController);
  });

  it("should return task statuses from service", async () => {
    const expected = {
      data: [
        {
          id: "1",
          name: "In Progress",
          code: "IN_PROGRESS",
          description: null,
        },
      ],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});

