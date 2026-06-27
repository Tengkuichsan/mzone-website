"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GallerySection.module.css";
import clsx from "clsx";
import { X } from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="gallery" className={styles.section}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Our <span className={styles.accent}>Gallery</span>
          </h2>
          <p className={styles.subtitle}>
            Take a look inside our state-of-the-art facility and see where the magic happens.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {items.map((img, index) => {
            const spanClass = index === 0 || index === 4 ? 'wide' : (index === 1 ? 'tall' : 'normal');
            return (
              <motion.div
                key={img.id}
                className={clsx(styles.imgWrapper, styles[spanClass])}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedImg(img.imageUrl)}
              >
                <div className={styles.overlay}>
                  <span>{img.title}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl} alt={img.title} loading="lazy" />
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedImg(null)}>
              <X size={32} />
            </button>
            <motion.img 
              src={selectedImg} 
              alt="Enlarged" 
              className={styles.lightboxImg}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
