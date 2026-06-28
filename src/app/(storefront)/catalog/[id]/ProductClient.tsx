"use client";

import React, { useState } from "react";
import styles from "./detail.module.css";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeft, Check, Truck, Shield, MessageCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProductData = {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
};

export default function ProductClient({ product, waNumber }: { product: ProductData, waNumber: string }) {
  const [activeSize, setActiveSize] = useState(product.sizes[0] || "");
  const [activeColor, setActiveColor] = useState(product.colors[0] || "");
  
  // Gallery states
  const [currentViewIndex, setCurrentViewIndex] = useState(0); // 0 = Front, 1 = Back
  const [showDetails, setShowDetails] = useState(false);

  const images = product.images;
  const frontImage = images.length > 0 ? images[0] : "/placeholder.png";
  const backImage = images.length > 1 ? images[1] : frontImage;
  const detailImages = images.slice(2, 5); // up to 3 detail images

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -10000) {
      // Swiped left (show back)
      setCurrentViewIndex(1);
    } else if (swipe > 10000) {
      // Swiped right (show front)
      setCurrentViewIndex(0);
    }
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleWaCheckout = () => {
    const text = `Halo Admin MZone, saya tertarik memesan produk ini:
- Produk: ${product.name}
- Warna: ${activeColor || "Tidak Ada"}
- Ukuran: ${activeSize || "Tidak Ada"}
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
          <div className={styles.visualSection}>
            
            <div className={clsx(styles.mainVisual, "glass")} style={{ position: "relative", overflow: "hidden" }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentViewIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  style={{ position: "absolute", width: "100%", height: "100%", cursor: "grab" }}
                  initial={{ opacity: 0, x: currentViewIndex === 0 ? -100 : 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentViewIndex === 0 ? 100 : -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={currentViewIndex === 0 ? frontImage : backImage} 
                    alt="Product View" 
                    className={styles.mainImage} 
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>
              </AnimatePresence>

              <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
                <button onClick={() => setCurrentViewIndex(0)} style={{ width: "10px", height: "10px", borderRadius: "50%", border: "none", backgroundColor: currentViewIndex === 0 ? "var(--color-maroon)" : "rgba(255,255,255,0.5)", cursor: "pointer" }} />
                <button onClick={() => setCurrentViewIndex(1)} style={{ width: "10px", height: "10px", borderRadius: "50%", border: "none", backgroundColor: currentViewIndex === 1 ? "var(--color-maroon)" : "rgba(255,255,255,0.5)", cursor: "pointer" }} />
              </div>
              <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "20px", fontSize: "0.8rem", pointerEvents: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                <ArrowLeft size={12}/> Geser <ArrowRight size={12}/>
              </div>
            </div>
            
            <AnimatePresence>
              {showDetails && detailImages.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.thumbnailList}
                  style={{ marginTop: "20px" }}
                >
                  <p style={{ width: "100%", textAlign: "center", fontSize: "0.9rem", color: "var(--color-silver)", marginBottom: "10px" }}>Detail Kelebihan (Kerah, Jahitan, dll)</p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    {detailImages.map((img, idx) => (
                      <div key={idx} className={styles.thumbnail} style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Detail ${idx+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!showDetails && detailImages.length > 0 && (
              <p style={{ textAlign: "center", marginTop: "15px", color: "var(--color-silver)", fontSize: "0.9rem", cursor: "pointer" }} onClick={() => setShowDetails(true)}>
                <Info size={14} style={{ display: "inline", marginRight: "4px" }}/> Klik gambar utama untuk melihat foto detail
              </p>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <span className={styles.badge}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.price}>{product.price}</p>
            
            <p className={styles.description}>
              {product.description}
            </p>
            
            {product.colors.length > 0 && (
              <div className={styles.optionsGroup}>
                <h4 className={styles.optionTitle}>Pilih Warna</h4>
                <div className={styles.colorOptions}>
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      className={clsx(styles.colorBtn, activeColor === color && styles.activeColor)}
                      onClick={() => setActiveColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes.length > 0 && (
              <div className={styles.optionsGroup}>
                <h4 className={styles.optionTitle}>Pilih Ukuran</h4>
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
            
            <div className={styles.actionButtons}>
              <button onClick={handleWaCheckout} className={clsx("btn", styles.waBtn)} style={{ width: "100%" }}>
                <MessageCircle size={20} /> Pesan via WhatsApp
              </button>
            </div>
            
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Shield size={20} />
                <span>100% Quality Guarantee</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} />
                <span>Pengiriman Seluruh Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
