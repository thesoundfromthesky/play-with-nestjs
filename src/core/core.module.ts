import { CacheModule, Module } from "@nestjs/common";
import { pipeProviders } from "./pipes";
import { filterProviders } from "./filters";
import { MongooseModule } from "@nestjs/mongoose";
import { interceptorProviders } from "./interceptors";
import { ApiConfigModule } from "./config";
import { mongooseModuleAsyncOptions } from "./config/mongoose-config/mongoose-module-async.options";
import { cacheModuleAsyncOptions } from "./config/cache-config/cache-module-async.options";

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions)
    // CacheModule.registerAsync(cacheModuleAsyncOptions)
  ],
  providers: [...pipeProviders, ...interceptorProviders, ...filterProviders]
})
export class CoreModule {}
