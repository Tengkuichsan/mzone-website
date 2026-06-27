"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import Link from "next/link";
import styles from "./HeroScene.module.css";

const FRAME_COUNT = 240;

// Helper to pad the frame number (e.g. 1 -> "00001")
const currentFrame = (index: number) => 
  `/kaos/${index.toString().padStart(5, "0")}.png`;

export default function HeroScene({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        // Draw the first frame once it's loaded
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            renderImageToCanvas(ctx, img, canvasRef.current);
          }
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const renderImageToCanvas = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    // Calculate aspect ratio to cover the canvas like object-fit: cover
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  };

  // Handle window resize to redraw canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && images.length > 0) {
        const ctx = canvasRef.current.getContext("2d");
        const frameIndex = Math.min(
          FRAME_COUNT - 1, 
          Math.max(0, Math.floor(scrollYProgress.get() * FRAME_COUNT))
        );
        if (ctx && images[frameIndex]) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          renderImageToCanvas(ctx, images[frameIndex], canvasRef.current);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, scrollYProgress]);

  // Scrub through frames on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0 || !canvasRef.current) return;
    
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    
    const ctx = canvasRef.current.getContext("2d");
    if (ctx && images[frameIndex]) {
      // Use requestAnimationFrame for drawing to ensure smooth vsync
      requestAnimationFrame(() => {
        renderImageToCanvas(ctx, images[frameIndex], canvasRef.current!);
      });
    }
  });

  return (
    <div ref={containerRef} className={styles.heroWrapper}>
      <div className={styles.stickyContainer}>
        {imagesLoaded < 10 && (
          <div className={styles.loader}>Loading 3D Assets...</div>
        )}
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.overlay}></div>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.contentGrid}>
            <div className={styles.leftSide}>
              <motion.div 
                className={styles.badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className={styles.badgeIcon}>🚀</span> Mitra Maklon #1 di Indonesia
              </motion.div>
              <h1 className={styles.title}>
                Wujudkan <span className={styles.accent}>Brand Fashion</span> Impianmu.
                <br />Mulai dari Nol, Kami Bimbing Sampai Jadi.
              </h1>
            </div>
            
            <motion.div 
              className={`${styles.rightSide} glass`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className={styles.subtitle}>
                PT MZone Garment Indonesia adalah mitra konveksi & maklon terpercaya. Baik Anda pemain lama maupun pemula yang baru merintis, pintu pabrik kami selalu terbuka. Kami juga memproduksi grosir Kaos Polos premium (Combed, TC, PE).
              </p>
              
              <div className={styles.features}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <span>Kualitas Premium</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <span>Konsultasi Gratis</span>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <span>Tepat Waktu</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href="#contact" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  Jadwalkan Konsultasi <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link href="/catalog" className="btn btn-secondary">
                  Katalog Polos
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {children}
      </div>
    </div>
  );
}
