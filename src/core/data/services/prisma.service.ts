import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { HesHttpContextService } from 'src/core/networking/services/hes-http-context.service';
import { PrismaClient } from 'src/generated/prisma/client';
import { auditingExtension } from '../extensions/auditing.extension';
import { PrismaClient as PrismaClientExtensionType } from '@prisma/client/extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnApplicationShutdown { 
  private readonly logger = new Logger(PrismaService.name);

  private extendedPrismaClient: PrismaClientExtensionType;

  constructor(
    private configService: ConfigService,
    private readonly httpContextService: HesHttpContextService,
  ) {
    const connectionString = configService.get<string>('PRISMA_DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }

    const adapter = new PrismaPg({ connectionString });

    const baseClient = new PrismaClient({
      adapter,
      log: ['info', 'warn', 'error'],
    });

    this.extendedPrismaClient = baseClient.$extends(
      auditingExtension(this.httpContextService),
    );
    this.logger.log('Prisma Client instance initialized and extended with auditing.');
  }

  get client(): PrismaClientExtensionType {
    return this.extendedPrismaClient;
  }

  async onModuleInit() {
    await this.extendedPrismaClient.$connect();
    this.logger.log('Prisma Client connected to database during application startup.');
  }

  // NestJS's OnApplicationShutdown hook for graceful disconnection
  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Prisma Client received shutdown signal: ${signal}. Initiating graceful disconnection.`);
    await this.extendedPrismaClient.$disconnect();
    this.logger.log('Prisma Client disconnected gracefully during application shutdown.');
  }

}
