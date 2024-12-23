import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    transactionOptions: {
      maxWait: 200000,
      timeout: 200000,
    },
  })
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;