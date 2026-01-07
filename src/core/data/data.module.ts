import {  Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { patchClassTransformer } from './transformers/patch.class-transformer';

@Global()
@Module({imports: [],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class DataModule {
  onModuleInit() {
    // Apply the patch when the module initializes
    patchClassTransformer();
  }
}
