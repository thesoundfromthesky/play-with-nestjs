import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AvatarModule } from './avatar/avatar.module';

const FEATURE_MODULES = [AuthModule, UserModule, AvatarModule];

@Module({
  imports: FEATURE_MODULES,
  exports: FEATURE_MODULES,
})
export class FeatureModule {}
