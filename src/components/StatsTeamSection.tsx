"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./StatsTeamSection.module.css";
import clsx from "clsx";
import { Mail } from "lucide-react";

const stats = [
  { value: 15, suffix: "+", label: "Tahun Pengalaman" },
  { value: 500, suffix: "+", label: "Brand Terbantu" },
  { value: 2, suffix: "M+", label: "Pakaian Diproduksi" },
  { value: 99, suffix: "%", label: "Klien Puas" },
];

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className={styles.statValue}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsTeamSection({ teamMembers = [] }: { teamMembers?: TeamMember[] }) {
  return (
    <section id="team" className={styles.section}>
      <div className={clsx("container", styles.container)}>
        <div className={styles.statsContainer}>
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              className={styles.statBox}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.statNumber}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className={styles.statLabel}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>
            Tim <span className={styles.accent}>Ahli</span> Kami
          </h2>
          <p className={styles.subtitle}>
            Berjumpa dengan para profesional yang berdedikasi untuk memberikan keunggulan di setiap pakaian.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {teamMembers.map((member, idx) => (
            <motion.div 
              key={member.id}
              className={styles.teamCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.imgWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.imageUrl} alt={member.name} loading="lazy" />
                <div className={styles.overlay}>
                  <div className={styles.socials}>
                    <a href="#" className={styles.socialIcon}><Mail size={18} /></a>
                  </div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
