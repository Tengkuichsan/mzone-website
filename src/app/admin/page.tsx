import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";
import Link from "next/link";

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  
  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>Selamat Datang, Admin</h1>
      <p style={{ color: "var(--color-silver)", marginBottom: "40px" }}>Ini adalah halaman dashboard panel kontrol MZone Garment.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        
        <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ color: "var(--color-silver)", marginBottom: "10px", fontSize: "1rem" }}>Total Produk Katalog</h3>
          <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "20px", color: "var(--color-maroon)" }}>
            {productCount}
          </div>
          <Link href="/admin/products" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", display: "inline-block" }}>
            Kelola Produk
          </Link>
        </div>
        
        <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ color: "var(--color-silver)", marginBottom: "10px", fontSize: "1rem" }}>Pengaturan WhatsApp</h3>
          <p style={{ marginBottom: "30px" }}>Atur nomor tujuan order pelanggan.</p>
          <Link href="/admin/settings" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", display: "inline-block" }}>
            Ubah Pengaturan
          </Link>
        </div>

      </div>
    </div>
  );
}
