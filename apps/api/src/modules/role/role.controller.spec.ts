import { Test, TestingModule } from "@nestjs/testing";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

describe("RoleController", () => {
  let controller: RoleController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: service }],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it("should return roles from service", async () => {
    const expected = {
      data: [{ id: "1", name: "Admin", code: "ADMIN", description: null }],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});
