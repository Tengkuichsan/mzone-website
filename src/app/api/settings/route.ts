import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  
  if (!key) return NextResponse.json({ message: "Key required" }, { status: 400 });
  
  try {
    const setting = await prisma.settings.findUnique({
      where: { key }
    });
    return NextResponse.json({ value: setting?.value || "" });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();
    
    if (!key) return NextResponse.json({ message: "Key required" }, { status: 400 });
    
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    
    return NextResponse.json(setting);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
