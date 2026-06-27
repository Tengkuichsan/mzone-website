"use client";

import React, { useState } from "react";
import styles from "./detail.module.css";
import clsx from "clsx";
import Link from "next/link";
import { ArrowLeft, Check, Truck, Shield, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [activeSize, setActiveSize] = useState("L");
  const [activeColor, setActiveColor] = useState("Black");

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "Maroon", "Navy", "White"];
  
  return (
    <div className={styles.detailPage}>
      <div className={clsx("container", styles.container)}>
        <Link href="/catalog" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Catalog
        </Link>
        
        <div className={styles.productGrid}>
          <div className={styles.visualSection}>
            <div className={styles.viewTabs}>
              <button 
                className={clsx(styles.tabBtn, activeTab === "gallery" && styles.activeTab)}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </button>
              <button 
                className={clsx(styles.tabBtn, activeTab === "360" && styles.activeTab)}
                onClick={() => setActiveTab("360")}
              >
                360&deg; View
              </button>
            </div>
            
            <div className={clsx(styles.mainVisual, "glass")}>
              {activeTab === "gallery" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80" 
                  alt="Product" 
                  className={styles.mainImage} 
                />
              ) : (
                <div className={styles.viewer360}>
                  <p>Interactive 3D Viewer Loading...</p>
                  <p className={styles.viewerSub}>Drag to rotate</p>
                </div>
              )}
            </div>
            
            <div className={styles.thumbnailList}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={styles.thumbnail}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80`} alt={`Thumb ${item}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.infoSection}>
            <span className={styles.badge}>Premium T-Shirt</span>
            <h1 className={styles.productName}>MZone Signature Corporate Tee</h1>
            <p className={styles.price}>Starting from <span>$5.00</span> / pcs</p>
            
            <p className={styles.description}>
              Elevate your corporate identity with our signature T-Shirt. Made from premium Cotton Combed 30s, it offers unmatched comfort, durability, and a professional look suitable for everyday office wear or casual events.
            </p>
            
            <div className={styles.optionsGroup}>
              <h4 className={styles.optionTitle}>Select Color</h4>
              <div className={styles.colorOptions}>
                {colors.map(color => (
                  <button 
                    key={color}
                    className={clsx(styles.colorBtn, activeColor === color && styles.activeColor)}
                    style={{ backgroundColor: color.toLowerCase() === 'maroon' ? 'var(--color-maroon)' : color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase() }}
                    onClick={() => setActiveColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            <div className={styles.optionsGroup}>
              <h4 className={styles.optionTitle}>Select Size</h4>
              <div className={styles.sizeOptions}>
                {sizes.map(size => (
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
            
            <div className={styles.specsBox}>
              <h4 className={styles.optionTitle}>Specifications</h4>
              <ul className={styles.specsList}>
                <li><Check size={16} className={styles.checkIcon}/> <strong>Material:</strong> Cotton Combed 30s</li>
                <li><Check size={16} className={styles.checkIcon}/> <strong>Production Time:</strong> 14-21 Working Days</li>
                <li><Check size={16} className={styles.checkIcon}/> <strong>Minimum Order (MOQ):</strong> 50 Pcs</li>
                <li><Check size={16} className={styles.checkIcon}/> <strong>Customization:</strong> Embroidery, Screen Print</li>
              </ul>
            </div>
            
            <div className={styles.actionButtons}>
              <button className="btn btn-primary" style={{ flex: 1, padding: "16px" }}>
                Request Quotation
              </button>
              <button className={clsx("btn", styles.waBtn)}>
                <MessageCircle size={20} /> WhatsApp
              </button>
            </div>
            
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <Shield size={20} />
                <span>100% Quality Guarantee</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} />
                <span>Nationwide Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
