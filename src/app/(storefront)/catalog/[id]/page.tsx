import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    return { title: "Produk Tidak Ditemukan - MZone Garment" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return { title: "Produk Tidak Ditemukan - MZone Garment" };
  }

  // Construct dynamic SEO metadata
  return {
    title: `Beli ${product.name} | MZone Garment Indonesia`,
    description: `Pesan ${product.name} dari MZone Garment. ${product.description.substring(0, 150)}...`,
    openGraph: {
      title: `${product.name} - MZone Garment`,
      description: `Pesan ${product.name} kualitas terbaik hanya di MZone Garment Indonesia.`,
      images: [
        {
          url: ((product.images as any)?.front) || "/placeholder.png",
          width: 800,
          height: 600,
          alt: product.name,
        }
      ]
    }
  }
}

export default async function ProductDetailPage({ params }: Props) {
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
  const images = (product.images as any) || { front: "", back: "", details: [] };
  const colors = (product.colors as any) || [];
  const sizes = (product.sizes as any) || [];
  const materials = ((product as any).materials as any) || [];

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
          sizes,
          materials
        }} 
        waNumber={waNumber} 
      />
    </main>
  );
}
