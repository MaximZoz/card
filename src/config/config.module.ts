import { Module } from '@nestjs/common';
import { AppConfig } from './configuration';

@Module({
  providers: [AppConfig],
  exports: [AppConfig],
})
export class ConfigModule {}
