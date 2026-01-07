import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });
};

declare global {
  var prisma: PrismaClient | undefined;
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
