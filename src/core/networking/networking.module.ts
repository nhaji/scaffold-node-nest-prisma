import { Global, Module } from '@nestjs/common';
import { HesHttpInterceptor } from './interceptors/hes-http.interceptor';
import { HesHttpContextService } from './services/hes-http-context.service';
import { HesHttpMiddleware } from './middlewares/hes-http.middleware';

@Global()
@Module({
  providers: [HesHttpContextService, HesHttpInterceptor, HesHttpMiddleware],
  exports: [HesHttpContextService, HesHttpInterceptor, HesHttpMiddleware],
})
export class NetworkingModule {}
