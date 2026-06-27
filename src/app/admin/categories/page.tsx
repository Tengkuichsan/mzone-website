"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        setNewCatName("");
        fetchCategories();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Master Data Kategori</h1>
      
      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "600px", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "15px" }}>Tambah Kategori Baru</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Nama kategori..."
            required
            style={{ flex: 1, padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", maxWidth: "600px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "15px 20px" }}>Nama Kategori</th>
              <th style={{ padding: "15px 20px", textAlign: "center", width: "100px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: "20px", textAlign: "center", color: "var(--color-silver)" }}>
                  Belum ada data kategori.
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "15px 20px" }}>{cat.name}</td>
                  <td style={{ padding: "15px 20px", textAlign: "center" }}>
                    <button onClick={() => handleDelete(cat.id)} style={{ background: "none", border: "none", color: "#ff5555", cursor: "pointer" }}>
                      <Trash2 size={18} />
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
