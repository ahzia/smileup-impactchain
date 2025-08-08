import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

console.log('🔧 Initializing Prisma Client...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🌐 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔗 DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql://'));

export const prisma = globalThis.__prisma || new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

console.log('✅ Prisma Client initialized successfully');

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
