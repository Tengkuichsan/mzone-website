import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus" }, { status: 500 });
  }
}
