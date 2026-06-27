const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPaths() {
  console.log("Fixing paths in database...");
  
  // Products
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.imageUrl && p.imageUrl.includes('kaos1')) {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl: p.imageUrl.replace('kaos1', 'kaos') }
      });
      console.log(`Updated product ${p.id}`);
    }
  }

  // Gallery
  const galleries = await prisma.gallery.findMany();
  for (const g of galleries) {
    if (g.imageUrl && g.imageUrl.includes('kaos1')) {
      await prisma.gallery.update({
        where: { id: g.id },
        data: { imageUrl: g.imageUrl.replace('kaos1', 'kaos') }
      });
      console.log(`Updated gallery ${g.id}`);
    }
  }

  console.log("Done fixing database.");
}

fixPaths().catch(console.error).finally(() => prisma.$disconnect());
