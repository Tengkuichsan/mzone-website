import React from "react";
import GalleryClient from "./GalleryClient";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Galeri Karya | MZone Garment",
  description: "Eksplorasi mahakarya pakaian dan seragam hasil produksi PT MZone Garment Indonesia.",
};

export default async function GalleryPage() {
  // Fetch all gallery items from database
  const galleryItems = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <GalleryClient items={galleryItems} />
    </>
  );
}
