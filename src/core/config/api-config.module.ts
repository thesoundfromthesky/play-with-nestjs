import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config-module-option';
import { ApiConfigService } from './api-config.service';
import { JwtConfigService } from './jwt-config';
import { MongooseConfigService } from './mongoose-config';
import { CacheConfigService } from './cache-config';

const apiConfigProviders = [
  ApiConfigService,
  JwtConfigService,
  MongooseConfigService,
  //   CacheConfigService
];

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  exports: [...apiConfigProviders],
  providers: [...apiConfigProviders]
})
export class ApiConfigModule {}
