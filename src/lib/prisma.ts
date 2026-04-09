import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const isLocalPostgres =
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1');

const adapter = isLocalPostgres
  ? new PrismaPg({ connectionString })
  : new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({
  adapter,
});