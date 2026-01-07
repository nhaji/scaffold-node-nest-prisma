import { Injectable, Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

import { HesCorsConfigService } from './services/hes-cors-config.service';
import { HesValidationPipeConfigService } from './services/hes-validation-pipe-config.service';
import { HesSerializationConfigService } from './services/hes-serialization-config.service';
import { HesSwaggerConfigService } from './services/hes-swagger-config.service';

@Injectable()
export class HesConfigService {
  private readonly logger = new Logger(HesConfigService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hesCorsConfigService: HesCorsConfigService,
    private readonly hesValidationPipeConfigService: HesValidationPipeConfigService,
    private readonly hesSerializationConfigService: HesSerializationConfigService,
    private readonly hesSwaggerConfigService: HesSwaggerConfigService,
  ) { }

  async configureApplication(app: NestFastifyApplication) {
    app.enableShutdownHooks(); // This tells NestJS to listen for OS signals (e.g., SIGTERM)
    this.logger.log(
      'NestJS application shutdown hooks enabled for graceful termination.',
    );
    // Configure CORS
    await this.hesCorsConfigService.setupCors(app);

    // Setup Global Validation Pipe
    this.hesValidationPipeConfigService.setupGlobalValidationPipe(app);

    // Setup Global Serialization config
    this.hesSerializationConfigService.setupGlobalSerialization(app);

    // Setup Swagger config
    this.hesSwaggerConfigService.setupSwagger(app);

  }

  /**
   * Retrieves the configured API prefix.
   * @returns The API prefix string.
   */
  getApiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', '/');
  }

  /**
   * Retrieves the configured application port.
   * @returns The application port string.
   */
  getAppPort(): string {
    return this.configService.get<string>('PORT', '3001');
  }
}