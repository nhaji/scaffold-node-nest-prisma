import { Module } from '@nestjs/common';
import { NetworkingModule } from './networking/networking.module';
import { LoggingModule } from './logging/logging.module';
import { DataModule } from './data/data.module';
import { HesConfigModule } from './config/hes-config.module';

@Module({
  imports: [NetworkingModule, LoggingModule, DataModule, HesConfigModule],
  exports: [NetworkingModule, LoggingModule, DataModule, HesConfigModule],
})
export class CoreModule {}
