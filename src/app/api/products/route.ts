import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Basic validation
    if (!data.name || !data.category || !data.price || !data.images || !data.description || !data.colors || !data.sizes) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
    }
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        images: data.images,
        colors: data.colors,
        sizes: data.sizes,
        description: data.description
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
