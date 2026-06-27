"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import clsx from "clsx";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/#about" },
  { name: "Layanan", href: "/#services" },
  { name: "Proses", href: "/#process" },
  { name: "Katalog", href: "/catalog" },
  { name: "Galeri", href: "/gallery" },
  { name: "Tim", href: "/#team" },
  { name: "Kontak", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={clsx(styles.navbar, scrolled && styles.scrolled)}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={clsx("container", styles.navContainer)}>
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

        <div className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </Link>
          ))}
          <Link href="/admin" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "14px" }}>
            Login
          </Link>
        </div>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.mobileNavLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/admin" className="btn btn-primary" style={{ marginTop: "20px", display: "inline-block", textAlign: "center" }}>
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
