import { Test, TestingModule } from "@nestjs/testing";
import { LookupsService } from "./lookups.service";
import { PrismaService } from "@/infrastructure/database/prisma.service";

class PrismaServiceMock {}

describe("LookupsService", () => {
  let service: LookupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LookupsService,
        { provide: PrismaService, useClass: PrismaServiceMock },
      ],
    }).compile();

    service = module.get<LookupsService>(LookupsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
