
import { PrismaClient } from '@prisma/client/extension'
import fs from 'fs'
import path from 'path'

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...')

  // Seed users
  const users = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'data/users/users.json'), 'utf-8'
  ))
  for (const data of users) {
    await prisma.user.create({ data })
  }

  // Seed profiles
  const profiles = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'data/users/profiles.json'), 'utf-8'
  ))
  for (const data of profiles) {
    await prisma.profile.create({ data })
  }

  console.log('✅ Users seeded!')
}