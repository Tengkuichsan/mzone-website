"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGallery = async () => {
    const res = await fetch("/api/gallery");
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) {
      alert("Harap isi judul dan pilih foto");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Upload File
      const uploadData = new FormData();
      uploadData.append("file", selectedFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      
      if (!uploadRes.ok) {
        alert("Gagal mengunggah foto");
        setLoading(false);
        return;
      }
      
      const { url: imageUrl } = await uploadRes.json();

      // 2. Save to Gallery
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl })
      });
      
      if (res.ok) {
        setTitle("");
        setSelectedFile(null);
        // Reset file input by accessing DOM if needed, or user can just see it reset
        const fileInput = document.getElementById("galleryFile") as HTMLInputElement;
        if(fileInput) fileInput.value = "";
        
        fetchGallery();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchGallery();
      }
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Kelola Galeri Master</h1>
      
      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "800px", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "15px" }}>Tambah Foto ke Galeri</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Judul / Keterangan Foto</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tim Produksi Menjahit Seragam..."
                required
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>File Foto (Otomatis Kompresi ke PNG)</label>
              <input 
                id="galleryFile"
                type="file" 
                accept="image/*"
                required
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: "flex-start", marginTop: "10px" }}>
            {loading ? "Mengompres & Menyimpan..." : "Tambahkan ke Galeri"}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "15px 20px", width: "150px" }}>Foto</th>
              <th style={{ padding: "15px 20px" }}>Keterangan</th>
              <th style={{ padding: "15px 20px", textAlign: "center", width: "100px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "20px", textAlign: "center", color: "var(--color-silver)" }}>
                  Galeri masih kosong.
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "15px 20px" }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />
                  </td>
                  <td style={{ padding: "15px 20px" }}>{item.title}</td>
                  <td style={{ padding: "15px 20px", textAlign: "center" }}>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", color: "#ff5555", cursor: "pointer" }}>
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
