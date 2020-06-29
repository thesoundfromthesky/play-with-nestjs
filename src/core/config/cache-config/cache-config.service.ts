import {
  Injectable,
  CacheOptionsFactory,
  CacheModuleOptions
} from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import { ApiConfigService } from "../api-config.service";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly apiConfigService: ApiConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5, // seconds
      // max: 10, // maximum number of items in cache
      store: redisStore,
      // host: "localhost",
      // port: 6379,
      url: this.apiConfigService.redisUrl
    };
  }
}
