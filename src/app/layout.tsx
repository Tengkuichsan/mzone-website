import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "PT MZone Garment Indonesia | Premium Garment Manufacturer",
  description: "Professional Garment Manufacturer & Uniform Supplier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
