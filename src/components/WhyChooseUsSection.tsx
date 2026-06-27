"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./WhyChooseUs.module.css";
import clsx from "clsx";
import { Users, Diamond, DollarSign, Clock, ShieldCheck, Cpu, Truck, ThumbsUp } from "lucide-react";

const reasons = [
  { icon: <Users size={28} />, title: "Bimbingan Ramah Pemula", desc: "Jangan ragu jika ini bisnis pertama Anda. Kami bimbing langkah demi langkah dari nol." },
  { icon: <Diamond size={28} />, title: "Kaos Polos Terbaik", desc: "Supplier tangan pertama (Combed, TC, PE) dengan jahitan rapi kelas distro." },
  { icon: <DollarSign size={28} />, title: "Harga Pabrik Langsung", desc: "Tanpa perantara. Harga terbaik untuk memaksimalkan profit bisnis Anda." },
  { icon: <Clock size={28} />, title: "Produksi Tepat Waktu", desc: "Alur kerja efisien dan terstruktur untuk pengiriman tepat jadwal." },
  { icon: <ShieldCheck size={28} />, title: "Quality Control Ketat", desc: "Setiap jahitan diperiksa secara detail melalui multi-tahap QC." },
  { icon: <Cpu size={28} />, title: "Pabrik Terbuka", desc: "Silakan datang dan lihat langsung proses produksi kami di pabrik." },
  { icon: <Truck size={28} />, title: "Pengiriman Nasional", desc: "Mendukung pengiriman aman ke seluruh wilayah di Nusantara." },
  { icon: <ThumbsUp size={28} />, title: "Mitra Terpercaya", desc: "Telah dipercaya oleh ratusan pengusaha dan korporasi terkemuka." },
];

export default function WhyChooseUsSection() {
  return (
    <section className={styles.section}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Mengapa Memilih <span className={styles.accent}>Kami</span>
          </h2>
          <p className={styles.subtitle}>
            Kami menggabungkan keahlian, dedikasi, dan transparansi untuk menjadi fondasi kuat bagi kesuksesan brand fashion Anda.
          </p>
        </div>

        <div className={styles.grid}>
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              className={clsx(styles.card, "glass")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -10, borderColor: "rgba(110, 15, 27, 0.5)" }}
            >
              <div className={styles.iconBox}>{item.icon}</div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
