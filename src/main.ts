import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { HesConfigService } from './core/config/hes-config.service';

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Retrieve the HesAppConfigService from the application context
  const hesConfigService = app.get(HesConfigService);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT', '3001');
  const env = configService.get<string>('NODE_ENV', 'production');
  const apiPrefix = configService.get<string>('API_PREFIX', '/');

  app.setGlobalPrefix(apiPrefix);

  // Use the orchestrator service to configure the entire application
  await hesConfigService.configureApplication(app);

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
