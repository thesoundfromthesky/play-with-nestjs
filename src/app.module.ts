import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core';
import { FeatureModule } from './feature';


@Module({
  imports: [CoreModule, FeatureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
