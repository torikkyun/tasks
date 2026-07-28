import { Test, TestingModule } from "@nestjs/testing";
import { TaskPriorityController } from "./task-priority.controller";
import { TaskPriorityService } from "./task-priority.service";

describe("TaskPriorityController", () => {
  let controller: TaskPriorityController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskPriorityController],
      providers: [{ provide: TaskPriorityService, useValue: service }],
    }).compile();

    controller = module.get<TaskPriorityController>(TaskPriorityController);
  });

  it("should return task priorities from service", async () => {
    const expected = {
      data: [{ id: "1", name: "High", code: "HIGH", description: null }],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});

