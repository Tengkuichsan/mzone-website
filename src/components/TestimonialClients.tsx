"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TestimonialClients.module.css";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "MZone Garment sangat membimbing saya yang baru pertama kali bikin brand. Dari milih bahan sampai sablon, semua diarahkan. Hasilnya luar biasa laku di pasaran!",
    author: "Budi P.",
    company: "Founder, Urbnesian",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    text: "Sebagai distro besar, kami sangat terbantu dengan pasokan Kaos Polos Combed 30s dari MZone. Kualitasnya stabil, jahitannya super rapi, dan pengiriman selalu on time.",
    author: "Siti Rahma",
    company: "Owner, LocalPride",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    text: "Sudah 5 tahun maklon seragam korporat di sini. Tidak pernah sekalipun mengecewakan. Sangat profesional dan kapasitas produksinya luar biasa.",
    author: "Kevin L.",
    company: "GlobalFinance",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];

const clients = [
  "Urbnesian", "LocalPride", "TechNesia", "GlobalFinance", "Bank Mandiri", "Gojek", "Erigo", "Roughneck"
];

export default function TestimonialClients() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={styles.section}>
      <div className={styles.clientsArea}>
        <div className="container">
          <p className={styles.clientSubtitle}>Telah Dipercaya oleh Ratusan Brand & Perusahaan</p>
        </div>
        <div className={styles.marquee}>
          <div className={styles.marqueeContent}>
            {[...clients, ...clients, ...clients].map((client, idx) => (
              <div key={idx} className={styles.clientLogo}>
                <span className={styles.logoText}>{client}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={clsx("container", styles.testimonialContainer)}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Kisah Sukses <span className={styles.accent}>Klien Kami</span>
          </h2>
        </div>

        <div className={styles.carouselContainer}>
          <button className={styles.navBtn} onClick={handlePrev} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>

          <div className={styles.carouselView}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={clsx(styles.testimonialCard, "glass")}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                transition={{ duration: 0.5 }}
              >
                <Quote size={40} className={styles.quoteIcon} />
                <p className={styles.testimonialText}>{testimonials[currentIndex].text}</p>
                <div className={styles.authorInfo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testimonials[currentIndex].img} alt={testimonials[currentIndex].author} className={styles.authorImg} />
                  <div>
                    <h4 className={styles.authorName}>{testimonials[currentIndex].author}</h4>
                    <p className={styles.authorCompany}>{testimonials[currentIndex].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className={styles.navBtn} onClick={handleNext} aria-label="Next">
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className={styles.dots}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={clsx(styles.dot, currentIndex === idx && styles.activeDot)}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
