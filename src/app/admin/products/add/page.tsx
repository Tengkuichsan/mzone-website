"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Harap pilih gambar produk (PNG/JPG)");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Image
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      
      if (!uploadRes.ok) {
        alert("Gagal mengunggah gambar");
        setLoading(false);
        return;
      }
      
      const { url: imageUrl } = await uploadRes.json();

      // 2. Save Product
      const productData = { ...formData, image: imageUrl };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Gagal menambahkan produk");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <Link href="/admin/products" style={{ color: "var(--color-silver)" }}>
          <ArrowLeft size={24} />
        </Link>
        <h1>Tambah Produk Baru</h1>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Nama Produk</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Kategori</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Harga (Teks)</label>
              <input 
                type="text" 
                required
                placeholder="Contoh: Mulai dari Rp 50.000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Gambar Produk (Otomatis Kompresi ke PNG)</label>
            <input 
              type="file" 
              accept="image/*"
              required
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
            />
            <small style={{ color: "var(--color-silver)" }}>Gambar yang Anda pilih akan di-kompres di server agar ringan.</small>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Deskripsi Produk</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white", resize: "vertical" }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Menyimpan & Mengompres Gambar..." : "Simpan Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}
