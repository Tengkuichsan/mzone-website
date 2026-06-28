import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    notFound();
  }

  const waSetting = await prisma.settings.findUnique({
    where: { key: "whatsapp_number" }
  });
  const waNumber = waSetting?.value || "6281234567890";

  // Parse JSON fields
  const images = (product.images as unknown as string[]) || [];
  const colors = (product.colors as unknown as string[]) || [];
  const sizes = (product.sizes as unknown as string[]) || [];

  return (
    <main style={{ backgroundColor: "var(--color-black)", minHeight: "100vh", color: "white" }}>
      <ProductClient 
        product={{
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          images,
          colors,
          sizes
        }} 
        waNumber={waNumber} 
      />
    </main>
  );
}
