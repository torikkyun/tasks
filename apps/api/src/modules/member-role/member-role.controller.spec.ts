import { Test, TestingModule } from "@nestjs/testing";
import { MemberRoleController } from "./member-role.controller";
import { MemberRoleService } from "./member-role.service";

describe("MemberRoleController", () => {
  let controller: MemberRoleController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberRoleController],
      providers: [{ provide: MemberRoleService, useValue: service }],
    }).compile();

    controller = module.get<MemberRoleController>(MemberRoleController);
  });

  it("should return member roles from service", async () => {
    const expected = {
      data: [
        { id: "1", name: "Developer", code: "DEVELOPER", description: null },
      ],
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
  });
});
