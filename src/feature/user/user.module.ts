import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userModelFactory } from 'src/mongoose';
import { SharedModule } from 'src/shared';

@Module({
  imports: [MongooseModule.forFeatureAsync([userModelFactory]), SharedModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
