import { Injectable, ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

@Injectable()
export class HesValidationPipeConfigService {

  private readonly logger = new Logger(HesValidationPipeConfigService.name);

  /**
   * Configures and enables the global ValidationPipe for DTO validation.
   * @param app The NestJS Fastify application instance.
   */
  setupGlobalValidationPipe(app: NestFastifyApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Recommended: Strips properties not defined in DTO
        forbidNonWhitelisted: true, // Recommended: Throws an error if non-whitelisted properties exist
        transform: true, // Recommended: Transforms payload objects to DTO instances
      }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        // This is the critical setting
        excludeExtraneousValues: true,
      })
    );
    this.logger.log('Global ValidationPipe configured.');
  }
}