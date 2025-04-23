import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Данные удалены из всех таблиц!");
}

main().finally(() => prisma.$disconnect());
