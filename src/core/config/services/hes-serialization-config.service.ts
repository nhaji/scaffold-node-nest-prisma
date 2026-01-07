import { Injectable, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

@Injectable()
export class HesSerializationConfigService {

private readonly logger = new Logger(HesSerializationConfigService.name);

  /**
   * Configures and enables the global Serialization for DTO.
   * @param app The NestJS Fastify application instance.
   */
  setupGlobalSerialization(app: NestFastifyApplication) {
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
          excludeExtraneousValues: true,
        })
      );
    this.logger.log('Global Serialization configured.');
  }
}