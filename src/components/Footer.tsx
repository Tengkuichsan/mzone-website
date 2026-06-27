import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import { MapPin, Phone, Mail } from "lucide-react";
import clsx from "clsx";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={clsx("container", styles.footerContainer)}>
        <div className={styles.column}>
          <Link href="/" className={styles.logo}>
            <img 
              src="/logo.png" 
              alt="MZone Garment Logo" 
              style={{ 
                height: "40px", 
                width: "auto",
                filter: "drop-shadow(0px 0px 1px rgba(255,255,255,0.8)) drop-shadow(0px 0px 1px rgba(255,255,255,0.8))"
              }} 
            />
          </Link>
          <p className={styles.description}>
            PT MZone Garment Indonesia. Mitra Maklon terpercaya untuk pengusaha fashion dan pusat grosir Kaos Polos (Combed, TC, PE) berkualitas. Bersama kami, bangun brand impian Anda menjadi nyata.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">FB</a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">IG</a>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">IN</a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">X</a>
          </div>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Tautan Cepat</h4>
          <ul className={styles.links}>
            <li><Link href="/#about">Tentang Kami</Link></li>
            <li><Link href="/catalog">Katalog</Link></li>
            <li><Link href="/#services">Layanan</Link></li>
            <li><Link href="/gallery">Galeri</Link></li>
            <li><Link href="/contact">Kontak</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Produk</h4>
          <ul className={styles.links}>
            <li><Link href="/catalog?category=tshirt">Kaos & Polo</Link></li>
            <li><Link href="/catalog?category=jacket">Jaket & Hoodie</Link></li>
            <li><Link href="/catalog?category=uniform">Seragam Kerja</Link></li>
            <li><Link href="/catalog?category=safety">Rompi Keselamatan</Link></li>
            <li><Link href="/catalog?category=custom">Pakaian Kustom</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.heading}>Info Kontak</h4>
          <ul className={styles.contactInfo}>
            <li>
              <MapPin size={18} className={styles.contactIcon} />
              <span>Jl. Curug Pinang RW No.9, RT.002, Kadu Jaya, Kec. Curug, Kabupaten Tangerang, Banten 15810</span>
            </li>
            <li>
              <Phone size={18} className={styles.contactIcon} />
              <span>+62 812 3456 7890</span>
            </li>
            <li>
              <Mail size={18} className={styles.contactIcon} />
              <span>mzonegarment@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
          <p style={{ margin: "0" }}>&copy; 2026 PT MZone Garment Indonesia. Seluruh hak cipta dilindungi.</p>
          <p style={{ margin: "0" }}>
            Created By <a href="https://www.instagram.com/t.fajar_ichsan/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: "bold" }}>Tech A Solution</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
