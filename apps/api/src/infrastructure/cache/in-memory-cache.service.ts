import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";

@Injectable()
export class InMemoryCacheService {
  private readonly namespaceKeys = new Map<string, Set<string>>();

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  buildKey(namespace: string, id: string): string {
    return `${namespace}:one:${id}`;
  }

  buildListKey(namespace: string, query: object): string {
    return `${namespace}:list:${Buffer.from(JSON.stringify(query)).toString("base64")}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: unknown, ttl = 180_000): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async setList(
    namespace: string,
    key: string,
    value: unknown,
    ttl = 180_000,
  ): Promise<void> {
    await this.cache.set(key, value, ttl);
    if (!this.namespaceKeys.has(namespace)) {
      this.namespaceKeys.set(namespace, new Set());
    }
    this.namespaceKeys.get(namespace)!.add(key);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async clearNamespace(namespace: string): Promise<void> {
    const keys = this.namespaceKeys.get(namespace);
    if (keys?.size) {
      await Promise.all([...keys].map((k) => this.cache.del(k)));
      keys.clear();
    }
  }
}
