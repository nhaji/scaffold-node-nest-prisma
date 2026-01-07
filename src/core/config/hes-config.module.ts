import { Global, Module } from '@nestjs/common';
import { HesConfigService } from './hes-config.service';
import { HesValidationPipeConfigService } from './services/hes-validation-pipe-config.service';
import { HesCorsConfigService } from './services/hes-cors-config.service';
import { HesSerializationConfigService } from './services/hes-serialization-config.service';
import { HesSwaggerConfigService } from './services/hes-swagger-config.service';

@Global()
@Module({
  imports: [],
  providers: [
    HesConfigService, // Orchestrator service
    HesCorsConfigService,
    HesValidationPipeConfigService,
    HesSerializationConfigService,
    HesSwaggerConfigService
  ],
  exports: [
    HesConfigService, // Export the orchestrator for main.ts
  ],
})
export class HesConfigModule {}
