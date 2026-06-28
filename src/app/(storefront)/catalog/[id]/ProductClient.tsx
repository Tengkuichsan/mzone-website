"use client";

import React, { useState } from "react";
import styles from "./detail.module.css";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Truck, Shield, MessageCircle, Hand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ColorSwatch = { name: string; hex: string };

type ProductData = {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  images: { front: string; back: string; details: string[] };
  colors: ColorSwatch[];
  sizes: string[];
  materials?: string[];
};

export default function ProductClient({ product, waNumber }: { product: ProductData, waNumber: string }) {
  const [activeSize, setActiveSize] = useState(product.sizes?.[0] || "");
  const [activeColor, setActiveColor] = useState<ColorSwatch | null>(product.colors?.[0] || null);
  const [activeMaterial, setActiveMaterial] = useState(product.materials?.[0] || "");
  
  // Gallery states
  const [currentView, setCurrentView] = useState<"front" | "back">("front");
  
  const frontImage = product.images?.front || "/placeholder.png";
  const backImage = product.images?.back || frontImage;
  const detailImages = product.images?.details || [];

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000) {
      setCurrentView("back");
    } else if (swipe > 10000) {
      setCurrentView("front");
    }
  };

  const handleWaCheckout = () => {
    const text = `Halo Admin MZone, saya tertarik memesan produk ini:
- Produk: ${product.name}
- Warna: ${activeColor ? activeColor.name : "Tidak Ada"}
- Ukuran: ${activeSize || "Tidak Ada"}
${product.materials?.length ? `- Bahan: ${activeMaterial || "Tidak Ada"}` : ""}
Apakah stoknya tersedia untuk dipesan?`;
    
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className={styles.detailPage}>
      <div className={clsx("container", styles.container)}>
        <Link href="/catalog" className={styles.backBtn}>
          <ArrowLeft size={18} /> Kembali ke Katalog
        </Link>
        
        <div className={styles.productGrid}>
          
          <div className={styles.visualContainer}>
            <div className={clsx(styles.mainVisual, "glass")}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentView}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  style={{ position: "absolute", width: "100%", height: "100%", cursor: "grab" }}
                  initial={{ opacity: 0, x: currentView === "front" ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentView === "front" ? 50 : -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={currentView === "front" ? frontImage : backImage} 
                    alt="Product View" 
                    className={styles.mainImage} 
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>
              </AnimatePresence>

              <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px", zIndex: 10 }}>
                <button onClick={() => setCurrentView("front")} style={{ width: "12px", height: "12px", borderRadius: "50%", border: "none", backgroundColor: currentView === "front" ? "var(--color-maroon)" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.3s" }} />
                <button onClick={() => setCurrentView("back")} style={{ width: "12px", height: "12px", borderRadius: "50%", border: "none", backgroundColor: currentView === "back" ? "var(--color-maroon)" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.3s" }} />
              </div>
              
              <div style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "rgba(0,0,0,0.6)", padding: "8px 12px", borderRadius: "20px", fontSize: "0.85rem", pointerEvents: "none", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Hand size={14}/> Geser <ArrowRight size={14}/>
              </div>
            </div>

            {detailImages.length > 0 && (
              <div className={styles.sidebarThumbnails}>
                {detailImages.map((img, idx) => (
                  <motion.div 
                    key={idx} 
                    className={styles.thumbnail}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Detail ${idx+1}`} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <span className={styles.badge}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.price}><span>{product.price}</span></div>
            
            <p className={styles.description}>
              {product.description}
            </p>
            
            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionsGroup}>
                <h4 className={styles.optionTitle}>Pilih Warna Eksklusif</h4>
                <div className={styles.colorOptions}>
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      className={clsx(styles.colorBtn, activeColor?.name === color.name && styles.activeColor)}
                      onClick={() => setActiveColor(color)}
                    >
                      <span className={styles.colorCircle} style={{ backgroundColor: color.hex }}></span>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionsGroup}>
                <h4 className={styles.optionTitle}>Ukuran Tersedia</h4>
                <div className={styles.sizeOptions}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={clsx(styles.sizeBtn, activeSize === size && styles.activeSize)}
                      onClick={() => setActiveSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.materials && product.materials.length > 0 && (
              <div className={styles.optionsGroup}>
                <h4 className={styles.optionTitle}>Bahan (Material)</h4>
                <div className={styles.sizeOptions}>
                  {product.materials.map(mat => (
                    <button 
                      key={mat}
                      className={clsx(styles.sizeBtn, activeMaterial === mat && styles.activeSize)}
                      onClick={() => setActiveMaterial(mat)}
                      style={{ padding: "0 20px" }}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.actionButtons}>
              <button onClick={handleWaCheckout} className={styles.waBtn}>
                <MessageCircle size={24} /> 
                Pesan & Konsultasi via WhatsApp
              </button>
            </div>
            
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Shield size={22} className={styles.trustIcon} />
                <span>100% Quality Guarantee</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={22} className={styles.trustIcon} />
                <span>Pengiriman Seluruh Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
