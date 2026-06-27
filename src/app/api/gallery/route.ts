import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(gallery);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, imageUrl } = await req.json();
    
    if (!title || !imageUrl) return NextResponse.json({ message: "Judul dan gambar harus diisi" }, { status: 400 });
    
    const galleryItem = await prisma.gallery.create({
      data: { title, imageUrl }
    });
    
    return NextResponse.json(galleryItem, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menyimpan foto ke galeri" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });
    
    await prisma.gallery.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menghapus foto" }, { status: 500 });
  }
}
