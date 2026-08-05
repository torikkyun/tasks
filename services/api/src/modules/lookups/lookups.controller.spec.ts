import { Test, TestingModule } from '@nestjs/testing';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';

describe('LookupsController', () => {
  let controller: LookupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LookupsController],
      providers: [LookupsService],
    }).compile();

    controller = module.get<LookupsController>(LookupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
