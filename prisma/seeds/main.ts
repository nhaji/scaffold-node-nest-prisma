import { seedUsers } from './seed-users';
import { seedSocial } from './seed-social';
import { ConfigService } from '@nestjs/config';
import { HesHttpContextService } from 'src/core/networking/services/hes-http-context.service';
import { PrismaService } from 'src/core/data/services/prisma.service';

const configService = new ConfigService();
const httpContextService = new HesHttpContextService();
const prismaService = new PrismaService(configService, httpContextService);
const prisma = prismaService.client;

async function main() {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'development':
      await seedDevelopment();
      break;
    default:
      await seedDevelopment();
  }

  console.log(`Seeding completed for ${env} environment`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seedDevelopment() {
  console.log('🚀 Starting database seeding...');

  //Clear existing data (optional - for development)
  console.log('🧹 Clearing existing data...');
  await clearDatabase();

  // Seed in correct order
  await seedUsers(prisma);
  await seedSocial(prisma);

  console.log('🎉 All seeding completed successfully!');
  console.log('📊 Data summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Comments: ${await prisma.comment.count()}`);
}

// Optional: Clear database function
async function clearDatabase() {
  const tables = ['comments', 'profiles', 'users'];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`,
      );
    } catch (error) {
      // Table might not exist yet
    }
  }
}
