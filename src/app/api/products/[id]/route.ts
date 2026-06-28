import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Delete physical images
    try {
      const images: any = product.images;
      const urlsToDelete: string[] = [];

      if (images) {
        if (Array.isArray(images)) {
          // Old format
          urlsToDelete.push(...images);
        } else if (typeof images === 'object') {
          // New format
          if (images.front) urlsToDelete.push(images.front);
          if (images.back) urlsToDelete.push(images.back);
          if (Array.isArray(images.details)) {
            urlsToDelete.push(...images.details);
          }
        }
      }

      const uploadDir = path.join(process.cwd(), "public");
      
      for (const fileUrl of urlsToDelete) {
        if (fileUrl && fileUrl.startsWith("/uploads/")) {
          // Prevent path traversal by only allowing files in uploads directory
          const safePath = path.join(uploadDir, fileUrl.replace(/^\//, ""));
          await unlink(safePath).catch(() => console.log(`File tidak ditemukan: ${safePath}`));
        }
      }
    } catch (fsErr) {
      console.error("Gagal menghapus file fisik:", fsErr);
      // Lanjutkan menghapus dari database meskipun file gagal dihapus
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Produk dan gambar berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus" }, { status: 500 });
  }
}
