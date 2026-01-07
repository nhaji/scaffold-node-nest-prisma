import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HesLoggingInterceptor } from './core/logging/interceptors/hes-logging.interceptor';
import { HesHttpInterceptor } from './core/networking/interceptors/hes-http.interceptor';
import { HesHttpMiddleware } from './core/networking/middlewares/hes-http.middleware';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: '.env',
    }),
    CoreModule,
    FeaturesModule
  ],

  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HesLoggingInterceptor, // Order 1: Logs incoming request
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HesHttpInterceptor, // Order 2: Formats response
    },
   
  ],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HesHttpMiddleware)
      .forRoutes('*'); // Apply to all routes
  }

}
