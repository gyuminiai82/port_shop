const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("DB 컬럼 업데이트 시작...");
    await prisma.$executeRawUnsafe('ALTER TABLE "MIN_SHOP_ORDER" ADD COLUMN "usedPoints" INTEGER NOT NULL DEFAULT 0;');
    console.log("usedPoints 추가 성공");
  } catch (e) {
    console.log("usedPoints 오류:", e.message);
  }
  
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "MIN_SHOP_ORDER" ADD COLUMN "earnedPoints" INTEGER NOT NULL DEFAULT 0;');
    console.log("earnedPoints 추가 성공");
  } catch (e) {
    console.log("earnedPoints 오류:", e.message);
  }
  
  console.log("완료!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
