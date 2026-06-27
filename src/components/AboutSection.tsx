"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./AboutSection.module.css";
import { Target, Lightbulb, TrendingUp, ShieldCheck } from "lucide-react";
import clsx from "clsx";

const timelineItems = [
  {
    year: "Awal Mula",
    title: "Konveksi Rumahan",
    description: "Berawal dari skala kecil, kami belajar pentingnya kualitas jahitan dan ketepatan waktu dalam memuaskan pelanggan.",
    icon: <Lightbulb size={24} />
  },
  {
    year: "Ekspansi",
    title: "Pabrik & Mesin Modern",
    description: "Berpindah ke fasilitas yang lebih besar dan berinvestasi pada mesin otomatis untuk kapasitas produksi massal yang stabil.",
    icon: <TrendingUp size={24} />
  },
  {
    year: "Inovasi",
    title: "Pusat Grosir Kaos Polos",
    description: "Mulai memproduksi Kaos Polos (Combed, TC, PE) berkualitas tinggi sebagai fondasi utama para pelaku sablon dan distro.",
    icon: <ShieldCheck size={24} />
  },
  {
    year: "Sekarang",
    title: "Mitra Maklon Terpercaya",
    description: "Dipercaya oleh ratusan brand lokal untuk memproduksi pakaian dari nol hingga siap jual dengan standar mutu terbaik.",
    icon: <Target size={24} />
  }
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className={styles.section}>
      <div className={clsx("container", styles.container)}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Lebih Dari Sekadar Pabrik,<br/>Kami Adalah <span className={styles.accent}>Mentor Bisnis Anda</span>
          </h2>
          <p className={styles.subtitle}>
            Tidak punya brand? Belum paham bahan? Datanglah ke kantor kami. Mari berdiskusi sambil minum kopi, dan kami bantu wujudkan ide fashion Anda menjadi produk nyata.
          </p>
        </motion.div>

        <div className={styles.content}>
          <div className={styles.timeline}>
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                className={styles.timelineItem}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={styles.timelineIconWrapper}>
                  <div className={styles.timelineIcon}>{item.icon}</div>
                  <div className={styles.timelineLine} />
                </div>
                <div className={clsx(styles.timelineContent, "glass")}>
                  <span className={styles.year}>{item.year}</span>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDesc}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className={styles.visionMission}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={clsx(styles.card, "glass")}>
              <h3 className={styles.cardTitle}>Visi Kami</h3>
              <p className={styles.cardDesc}>
                Menjadi pabrik konveksi dan mitra maklon pakaian paling dipercaya di Indonesia, yang melahirkan ratusan brand fashion sukses.
              </p>
            </div>
            <div className={clsx(styles.card, "glass")}>
              <h3 className={styles.cardTitle}>Misi Kami</h3>
              <p className={styles.cardDesc}>
                Memberikan pendampingan penuh kepada pengusaha pemula dan memproduksi pakaian berkualitas tinggi dengan dukungan tim ahli kami.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
