import styles from "./page.module.css";
export const dynamic = "force-dynamic";
import React from "react";
import HeroScene from "@/components/HeroScene";
import AboutSection from "@/components/AboutSection";
import ProductSection from "@/components/ProductSection";
import ProcessSection from "@/components/ProcessSection";
import GallerySection from "@/components/GallerySection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import StatsTeamSection from "@/components/StatsTeamSection";
import TestimonialClients from "@/components/TestimonialClients";
import FaqContactSection from "@/components/FaqContactSection";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const latestProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  const galleryItems = await prisma.gallery.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const teamMembers = await prisma.team.findMany({
    orderBy: { createdAt: "asc" }
  });

  const whatsappSetting = await prisma.settings.findUnique({
    where: { key: "whatsapp_number" }
  });
  const whatsappNumber = whatsappSetting?.value || "6281234567890";

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <HeroScene />
      </div>
      <AboutSection />
      <ProductSection products={latestProducts} />
      <ProcessSection />
      <GallerySection items={galleryItems} />
      <WhyChooseUsSection />
      <StatsTeamSection teamMembers={teamMembers} />
      <TestimonialClients />
      <FaqContactSection whatsappNumber={whatsappNumber} />
    </main>
  );
}
