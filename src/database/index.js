import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { log } from '../utils/logger.js';

const { Pool } = pg;

let prisma;

export function getDatabase() {
  if (!prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({
      adapter,
      log: process.env.LOG_LEVEL === 'debug'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }
  return prisma;
}

export async function connectDatabase() {
  try {
    const db = getDatabase();
    await db.$connect();
    log.db('Connected to Neon PostgreSQL');
    return db;
  } catch (error) {
    log.db(`Failed to connect: ${error.message}`, 'error');
    throw error;
  }
}

export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    log.db('Disconnected from database');
  }
}

export default { getDatabase, connectDatabase, disconnectDatabase };
