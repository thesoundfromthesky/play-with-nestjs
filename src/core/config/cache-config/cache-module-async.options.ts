import { CacheModuleAsyncOptions } from "@nestjs/common";
import { CacheConfigService } from "./cache-config.service";
import { ApiConfigModule } from "../api-config.module";

export const cacheModuleAsyncOptions: CacheModuleAsyncOptions = {
  imports: [ApiConfigModule],
  useExisting: CacheConfigService
};

// export const cacheModuleAsyncOptions: CacheModuleAsyncOptions = {
//   imports: [ConfigGetterModule],
//   useFactory: async (apiConfigService: ApiConfigService) => ({
// ttl: 5, // seconds
// // max: 10, // maximum number of items in cache
// store: redisStore,
// //   host: "localhost",
// //   port: 6379
// url: apiConfigService.redisUrl
//   }),
//   inject: [ApiConfigService]
// };
