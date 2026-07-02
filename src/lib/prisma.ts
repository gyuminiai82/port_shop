import { PrismaClient } from './generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// 강제로 기존 인스턴스 초기화 (스키마 변경 사항 반영을 위함 - 문의 모듈 반영)
globalForPrisma.prisma = undefined;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
