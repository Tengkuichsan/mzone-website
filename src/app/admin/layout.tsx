import React from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>MZone <span className={styles.accent}>Admin</span></h2>
        </div>
        <nav className={styles.nav}>
          <a href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="/admin/products" className={styles.navItem}>
            <Package size={20} />
            <span>Produk Katalog</span>
          </a>
          <a href="/admin/categories" className={styles.navItem}>
            <Package size={20} />
            <span>Kategori Master</span>
          </a>
          <a href="/admin/gallery" className={styles.navItem}>
            <Package size={20} />
            <span>Galeri Master</span>
          </a>
          <a href="/admin/team" className={styles.navItem}>
            <Package size={20} />
            <span>Tim Master</span>
          </a>
          <a href="/admin/integrations" className={styles.navItem}>
            <Settings size={20} />
            <span>Integrasi API</span>
          </a>
          <a href="/admin/settings" className={styles.navItem}>
            <Settings size={20} />
            <span>Pengaturan Web</span>
          </a>
        </nav>
        <div className={styles.logoutWrapper}>
          <a href="/api/auth/logout" className={styles.navItem}>
            <LogOut size={20} />
            <span>Keluar</span>
          </a>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
