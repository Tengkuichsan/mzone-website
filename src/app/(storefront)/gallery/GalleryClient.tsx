"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./page.module.css";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the vertical scroll of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate total width based on items (approx 3 items per column, so length/3 columns)
  // We'll move from 0 to -100% of the scroll width
  // Since we don't know the exact width, we use a large negative vw
  // A better approach is moving it - (total scrollable distance). For simplicity, let's use a wide vw translation.
  // 3 items = 1 column. 15 items = 5 columns. 
  // Each column is about 400px wide.
  const columnsCount = Math.ceil(items.length / 3);
  const totalWidthVw = Math.max(100, columnsCount * 25); 
  
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${totalWidthVw - 100}vw`]);

  // Group items into columns of 3
  const columns: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    columns.push(items.slice(i, i + 3));
  }

  // Helper to determine CSS classes for the puzzle look
  const getSizeClass = (colIndex: number, rowIndex: number) => {
    // Just some pseudo-random pattern based on index to make it look like a masonry puzzle
    if ((colIndex + rowIndex) % 3 === 0) return styles["size-large"];
    if ((colIndex + rowIndex) % 2 === 0) return styles["size-medium"];
    return styles["size-small"];
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Galeri <span className={styles.accent}>Karya</span>
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Geser (Scroll) ke bawah untuk menjelajahi pameran karya-karya terbaik dari mesin produksi kami.
        </motion.p>
      </div>

      <div ref={containerRef} className={styles.scrollContainer}>
        <div className={styles.stickyScene}>
          <motion.div 
            className={styles.carousel}
            style={{ x }}
          >
            {columns.map((col, colIdx) => (
              <div key={colIdx} className={styles.column}>
                {col.map((item, rowIdx) => (
                  <motion.div 
                    key={item.id}
                    className={clsx(styles.cardWrapper, getSizeClass(colIdx, rowIdx))}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className={styles.image} />
                    <div className={styles.overlay}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            
            {/* End of Gallery message */}
            <div className={styles.column} style={{ justifyContent: "center", paddingLeft: "5vw" }}>
              <div style={{ textAlign: "center", width: "300px" }}>
                <h3 style={{ fontSize: "2rem", color: "var(--color-white)", marginBottom: "16px" }}>
                  Ingin Membuat <span style={{ color: "var(--color-maroon)" }}>Karya Anda Sendiri?</span>
                </h3>
                <a href="/catalog" className="btn btn-primary" style={{ display: "inline-block" }}>
                  Mulai Konsultasi <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                </a>
              </div>
            </div>

          </motion.div>

          <div className={styles.scrollIndicator}>
            <span>Scroll untuk menjelajah</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </main>
  );
}
