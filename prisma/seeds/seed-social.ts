
import { PrismaClient } from '@prisma/client/extension'
import fs from 'fs'
import path from 'path'

export async function seedSocial(prisma: PrismaClient) {
  console.log('💬 Seeding social...')

  // Seed comments
  const comments = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'data/social/comments.json'), 'utf-8'
  ))
  for (const data of comments) {
    await prisma.comment.create({ data })
  }

  console.log('✅ Social seeded!')
}