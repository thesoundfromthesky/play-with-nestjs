import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { avatarModelFactory } from 'src/mongoose';
import { SharedModule } from 'src/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ApiConfigModule } from 'src/core';

@Module({
  imports: [
    ApiConfigModule,
    MongooseModule.forFeatureAsync([avatarModelFactory]),
    SharedModule,
    UserModule,
  ],
  providers: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}
