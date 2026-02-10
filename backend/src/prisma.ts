// src/prisma.ts
import 'dotenv/config';            // ให้ Prisma เห็น DATABASE_URL จาก .env
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// สร้าง adapter ต่อ PostgreSQL ผ่าน DATABASE_URL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// ใช้ global เดิมสำหรับ dev (nodemon reload แล้วไม่สร้าง client ซ้ำ)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // ✅ สำคัญ: บอก Prisma ให้ใช้ adapter นี้
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
