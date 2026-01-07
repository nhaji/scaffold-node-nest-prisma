import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';

@Controller('')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor() {}

  @Get('health')
  async healthCheck() {
    this.logger.log('🔍 Testing APP health...');

    return {
      message: 'Healthy',
    };
  }
}
