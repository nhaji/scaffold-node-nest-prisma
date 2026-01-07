import { Injectable, Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import fastifyCors from '@fastify/cors';

@Injectable()
export class HesCorsConfigService {
  private readonly logger = new Logger(HesCorsConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Configures and registers CORS middleware for the application.
   * @param app The NestJS Fastify application instance.
   */
  async setupCors(app: NestFastifyApplication) {
    const env = this.configService.get<string>('NODE_ENV', 'production');

    await app.register(fastifyCors, {
      origin: env === 'development'
        ? '*'
        : ['TRUSTED_DOMAIN'], // IMPORTANT: Replace 'TRUSTED_DOMAIN' with your actual trusted domains
      credentials: true,
    });
    this.logger.log('CORS configured.');
  }
}