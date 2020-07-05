import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { strategyProviders } from './strategies';
import { ApiConfigModule, authModuleOptions } from 'src/core';
import { jwtModuleAsyncOptions } from 'src/core/config/jwt-config/jwt-module-async.options';
import { MongooseModule } from '@nestjs/mongoose';
import { authModelFactory } from 'src/mongoose';
import { TokenService, RedisService } from './services';
import { SharedModule } from 'src/shared';

@Module({
  imports: [
    ApiConfigModule,
    UserModule,
    PassportModule.register(authModuleOptions),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeatureAsync([authModelFactory]),
    SharedModule,
  ],
  providers: [
    AuthService,
    ...strategyProviders,
    TokenService,
    // RedisService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
