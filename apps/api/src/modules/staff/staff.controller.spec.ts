import { Test, TestingModule } from "@nestjs/testing";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { StaffQueryDto } from "./dto/query-staff.dto";

describe("StaffController", () => {
  let controller: StaffController;
  let service: { findAll: jest.Mock; findOne: jest.Mock };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [{ provide: StaffService, useValue: service }],
    }).compile();

    controller = module.get<StaffController>(StaffController);
  });

  it("should return staff list from service", async () => {
    const expected = {
      data: [
        {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          phone: "0123456789",
          avatarUrl: "https://example.com/avatar.png",
          createdAt: new Date(),
          role: { id: "r1", name: "Admin", code: "ADMIN" },
          department: { id: "d1", name: "HR", code: "HR" },
        },
      ],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    service.findAll.mockResolvedValue(expected);

    await expect(controller.findAll(new StaffQueryDto())).resolves.toEqual(
      expected,
    );
  });

  it("should return staff detail from service", async () => {
    const expected = {
      data: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        phone: "0123456789",
        avatarUrl: "https://example.com/avatar.png",
        createdAt: new Date(),
        role: { id: "r1", name: "Admin", code: "ADMIN" },
        department: { id: "d1", name: "HR", code: "HR" },
      },
    };

    service.findOne.mockResolvedValue(expected);

    await expect(controller.findOne("1")).resolves.toEqual(expected);
  });
});
