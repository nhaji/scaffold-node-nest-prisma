import { Module } from '@nestjs/common';
import { HesLoggingInterceptor } from './interceptors/hes-logging.interceptor';

@Module({
  imports: [],
  providers: [
    HesLoggingInterceptor,
  ],
  exports: [
    HesLoggingInterceptor, 
  ],
})
export class LoggingModule {}
