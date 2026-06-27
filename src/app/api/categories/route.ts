import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name) return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 });
    
    const category = await prisma.category.create({
      data: { name }
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal membuat kategori" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });
    
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menghapus kategori" }, { status: 500 });
  }
}
