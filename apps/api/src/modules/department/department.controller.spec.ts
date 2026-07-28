import { Test, TestingModule } from "@nestjs/testing";
import { DepartmentService } from "./department.service";
import { DepartmentController } from "./department.controller";

describe("DepartmentController", () => {
  let controller: DepartmentController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [{ provide: DepartmentService, useValue: service }],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
  });

  it("should return departments from service", async () => {
    const expected = {
      data: [{ id: "1", name: "Engineering", code: "ENG", description: null }],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});
