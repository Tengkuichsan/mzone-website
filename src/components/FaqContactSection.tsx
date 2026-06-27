"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FaqContactSection.module.css";
import clsx from "clsx";
import { Plus, Minus, MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const faqs = [
  { question: "Berapa minimum order quantity (MOQ)?", answer: "Standar MOQ kami adalah 50 pcs per desain/warna. Namun, untuk bahan khusus yang kustom, MOQ mungkin lebih tinggi. Silakan hubungi tim penjualan kami untuk detail lebih lanjut." },
  { question: "Berapa lama proses produksi memakan waktu?", answer: "Waktu produksi standar adalah 14-21 hari kerja setelah desain disetujui dan pembayaran uang muka (DP) diterima. Pesanan kilat dapat diakomodasi tergantung pada kapasitas pabrik kami." },
  { question: "Bisakah saya meminta sampel sebelum produksi massal?", answer: "Ya, kami menyediakan sampel fisik. Biaya sampel akan dikurangi dari tagihan akhir Anda jika Anda melanjutkan ke pesanan massal." },
  { question: "Apakah Anda melayani pengiriman ke seluruh Indonesia?", answer: "Tentu, kami melayani pengiriman ke seluruh wilayah Indonesia melalui mitra logistik terpercaya kami." },
];

export default function FaqContactSection({ whatsappNumber = "6281234567890" }: { whatsappNumber?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Halo%20MZone%20Garment,%20saya%20ingin%20bertanya...`, '_blank');
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.grid}>
          {/* FAQ Section */}
          <div className={styles.faqWrapper}>
            <h2 className={styles.title}>
              Pertanyaan yang Sering <span className={styles.accent}>Diajukan</span>
            </h2>
            <p className={styles.subtitle}>Temukan jawaban atas pertanyaan umum tentang layanan dan proses produksi kami.</p>
            
            <div className={styles.accordion}>
              {faqs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button 
                    className={clsx(styles.faqQuestion, openFaq === index && styles.activeQuestion)}
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    {openFaq === index ? <Minus size={20} className={styles.faqIcon} /> : <Plus size={20} className={styles.faqIcon} />}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.faqAnswerWrapper}
                      >
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className={styles.contactWrapper}>
            <div className={clsx(styles.contactCard, "glass")}>
              <h2 className={styles.title} style={{ fontSize: "2rem", marginBottom: "8px" }}>
                Mari <span className={styles.accent}>Ngopi & Diskusi</span>
              </h2>
              <p style={{ color: "var(--color-silver)", marginBottom: "32px", fontSize: "1.1rem" }}>
                Punya ide tapi bingung mulainya? Jadwalkan pertemuan dan datang ke kantor kami.
              </p>

              <div className={styles.contactInfoGrid}>
                <div className={styles.infoItem}>
                  <MapPin size={24} className={styles.infoIcon} />
                  <div>
                    <h4>Kantor & Pabrik</h4>
                    <p>
                      <a href="https://maps.app.goo.gl/tUWvWCZyKTLtx3pt7" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-silver)", textDecoration: "none" }}>
                        Jl. Curug Pinang RW No.9, RT.002, Kadu Jaya, Kec. Curug,<br/>Kabupaten Tangerang, Banten 15810
                      </a>
                    </p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={24} className={styles.infoIcon} />
                  <div>
                    <h4>Telepon & WhatsApp</h4>
                    <p>+{whatsappNumber}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={24} className={styles.infoIcon} />
                  <div>
                    <h4>Email</h4>
                    <p>mzonegarment@gmail.com</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={24} className={styles.infoIcon} />
                  <div>
                    <h4>Jam Operasional</h4>
                    <p>Senin - Jumat: 08:00 - 17:00<br/>Sabtu: 08:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "30px" }}>
                <button onClick={handleWhatsApp} className={clsx("btn btn-primary", styles.submitBtn)} style={{ width: "100%", justifyContent: "center" }}>
                  Jadwalkan Konsultasi via WhatsApp <Send size={18} style={{ marginLeft: "8px" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
