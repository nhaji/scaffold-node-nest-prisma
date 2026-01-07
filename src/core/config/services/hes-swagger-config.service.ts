import { Injectable, Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class HesSwaggerConfigService {
  private readonly logger = new Logger(HesSwaggerConfigService.name);

  constructor(private readonly configService: ConfigService) { }

  /**
   * Configures Swagger.
   * @param app The NestJS Fastify application instance.
   */
  async setupSwagger(app: NestFastifyApplication) {
    const appVersion = this.configService.get<string>('APP_VERSION', '1.0');
    const appName = this.configService.get<string>('APP_NAME', 'API Name');
    const appDescription = this.configService.get<string>('APP_DESCRIPTION', 'API Description');
    const apptag = this.configService.get<string>('APP_TAG', 'API Tag');
    const swaggerTitle = this.configService.get<string>('SWAGGER_TITLE', 'API Docs');
    const swaggerPrefix = this.configService.get<string>('SWAGGER_PREFIX', 'api');

    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(appDescription)
      .setVersion(appVersion)
      .addTag(apptag)
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup(swaggerPrefix, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: swaggerTitle,
    });

    this.logger.log(`Swagger configured for ${appName}: ${appDescription}`);
  }
}