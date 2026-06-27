import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const team = await prisma.team.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(team);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, role, imageUrl } = await req.json();
    
    if (!name || !role || !imageUrl) return NextResponse.json({ message: "Nama, jabatan, dan foto harus diisi" }, { status: 400 });
    
    const teamMember = await prisma.team.create({
      data: { name, role, imageUrl }
    });
    
    return NextResponse.json(teamMember, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menyimpan anggota tim" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });
    
    await prisma.team.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menghapus anggota tim" }, { status: 500 });
  }
}
