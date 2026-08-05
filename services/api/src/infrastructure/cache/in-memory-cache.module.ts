import { Global, Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { InMemoryCacheService } from "./in-memory-cache.service";

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 180_000,
      max: 100,
    }),
  ],
  providers: [InMemoryCacheService],
  exports: [InMemoryCacheService],
})
export class InMemoryCacheModule {}
