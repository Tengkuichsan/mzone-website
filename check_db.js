const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
    take: 1
  });
  console.log(JSON.stringify(products[0], null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
