"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import styles from "./ProductSection.module.css";
import clsx from "clsx";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
};

const FRAME_COUNT = 240;
const getFramePath = (index: number) => `/Hang_Tag/${index.toString().padStart(5, "0")}.png`;

export default function ProductSection({ products = [] }: { products?: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setIsLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Update canvas on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded || !canvasRef.current) return;
    
    // Calculate which frame to show based on scroll progress (0 to 1)
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latest * FRAME_COUNT))
    );
    
    const ctx = canvasRef.current.getContext("2d");
    if (ctx && images[frameIndex]) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(images[frameIndex], 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  });

  return (
    <section id="products" className={styles.section}>
      <div ref={sectionRef} className={styles.animationWrapper}>
        <div className={styles.stickyHeader}>
          <div className={styles.canvasContainer}>
            <canvas 
              ref={canvasRef} 
              width={1920} 
              height={1080} 
              className={styles.sequenceCanvas}
            />
          </div>
          <div className={styles.titleContent}>
            <h2 className={styles.title}>
              Koleksi <span className={styles.accent}>Premium</span> Kami
            </h2>
            <p className={styles.subtitle}>
              Mulai dari seragam custom hingga pakaian kasual, kami memberikan keunggulan di setiap jahitannya.
            </p>
            <div className={styles.actionContainer}>
              <Link href="/catalog" className="btn btn-primary">
                Lihat Katalog Lengkap <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className={clsx("container", styles.container)} style={{ paddingTop: "60px", paddingBottom: "120px" }}>
          <div className={styles.grid}>
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.cardWrapper}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className={clsx(styles.card, "glass")}
                  whileHover={{
                    y: -15,
                    rotateX: 5,
                    rotateY: -5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 20px rgba(110, 15, 27, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={styles.imageContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className={styles.image} />
                    <div className={styles.overlay} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <div className={styles.details}>
                      <p className={styles.material}><span>Kategori:</span> {item.category}</p>
                      <p className={styles.price}>{item.price}</p>
                    </div>
                    <Link href={`/catalog?product=${item.id}`} className={clsx("btn btn-secondary", styles.cardBtn)}>
                      Lihat Detail
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
