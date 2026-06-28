import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `image-${uniqueSuffix}.png`; // Always output as PNG since user requested PNG input
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Compress using sharp
    await sharp(buffer)
      .resize(800, null, { withoutEnlargement: true }) // Max width 800px, auto height
      .png({ quality: 80, compressionLevel: 8 }) // Compress PNG
      .toFile(filepath);

    // Return the URL to be stored in the database
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (err) {
    console.error("Error uploading file:", err);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengunggah file" }, { status: 500 });
  }
}
