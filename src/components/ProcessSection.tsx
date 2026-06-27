"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./ProcessSection.module.css";
import clsx from "clsx";
import { 
  MessageSquare, 
  PenTool, 
  Layers, 
  Scissors, 
  Shirt, 
  Paintbrush, 
  SearchCheck, 
  Package, 
  Truck,
  Search,
  CheckCircle2
} from "lucide-react";

const processSteps = [
  { id: 1, title: "Ngobrol Santai", icon: <MessageSquare size={32} /> },
  { id: 2, title: "Pilih Desain", icon: <PenTool size={32} /> },
  { id: 3, title: "Bahan (Combed, TC, PE)", icon: <Layers size={32} /> },
  { id: 4, title: "Potong Pola", icon: <Scissors size={32} /> },
  { id: 5, title: "Jahit Presisi", icon: <Shirt size={32} /> },
  { id: 6, title: "Sablon/Bordir", icon: <Paintbrush size={32} /> },
  { id: 7, title: "Quality Control", icon: <SearchCheck size={32} /> },
  { id: 8, title: "Kemasan Rapi", icon: <Package size={32} /> },
  { id: 9, title: "Siap Dijual", icon: <Truck size={32} /> },
];

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [poNumber, setPoNumber] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });
  
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleTrackPO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poNumber.trim()) return;
    
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);
    
    try {
      const res = await fetch(`/api/track-po?po_number=${encodeURIComponent(poNumber)}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setTrackResult(data.data);
      } else {
        setTrackError(data.error || "Gagal melacak PO.");
      }
    } catch (err) {
      setTrackError("Terjadi kesalahan jaringan.");
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <section id="process" className={styles.section} ref={containerRef}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Tahapan <span className={styles.accent}>Membangun Brand</span> Anda
          </h2>
          <p className={styles.subtitle}>
            Jadwalkan waktu, kunjungi pabrik kami. Kita diskusikan visi Anda, pilih bahan yang tepat, dan biarkan kami memproduksinya hingga siap rilis ke pasar.
          </p>
        </div>

        <div className={styles.processWrapper}>
          {/* Horizontal Line for Desktop */}
          <div className={styles.lineBg}>
            <motion.div className={styles.lineFill} style={{ width: lineWidth }} />
          </div>

          <div className={styles.stepsContainer}>
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.id} 
                className={styles.stepBox}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.iconWrapper}>
                  {step.icon}
                  <div className={styles.stepNumber}>{step.id}</div>
                </div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PO Tracking Section */}
        <div className={styles.trackingWrapper}>
          <div className={clsx(styles.trackingCard, "glass")}>
            <div className={styles.trackingHeader}>
              <Search size={28} className={styles.trackingIcon} />
              <div>
                <h3 className={styles.trackingTitle}>Lacak Status Pesanan (PO)</h3>
                <p className={styles.trackingSubtitle}>Pantau perkembangan produksi pesanan Anda secara real-time.</p>
              </div>
            </div>

            <form onSubmit={handleTrackPO} className={styles.trackingForm}>
              <input 
                type="text" 
                placeholder="Masukkan Nomor PO (Cth: PO-2026-001)" 
                className={styles.trackingInput}
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                required
              />
              <button type="submit" className={styles.trackingBtn} disabled={trackLoading}>
                {trackLoading ? "Mencari..." : "Lacak PO"}
              </button>
            </form>

            {trackError && (
              <div className={styles.trackingError}>
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className={styles.trackingResult}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultInfo}>
                    <h4>{trackResult.po_number}</h4>
                    <p>{trackResult.product} &bull; {trackResult.quantity} pcs</p>
                  </div>
                  <div className={styles.resultStatus}>
                    <span className={styles.statusBadge}>{trackResult.current_status}</span>
                  </div>
                </div>

                <div className={styles.timelineResult}>
                  {trackResult.timeline.map((stage: any, idx: number) => (
                    <div key={idx} className={clsx(styles.timelineStage, stage.completed && styles.stageCompleted)}>
                      <div className={styles.stageIcon}>
                        {stage.completed ? <CheckCircle2 size={16} /> : <div className={styles.stageDot} />}
                      </div>
                      <div className={styles.stageDetails}>
                        <h5>{stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}</h5>
                        {stage.date && <span>{new Date(stage.date).toLocaleDateString("id-ID")}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.resultFooter}>
                  <p>Estimasi Pengiriman: <strong>{new Date(trackResult.estimated_delivery).toLocaleDateString("id-ID")}</strong></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
