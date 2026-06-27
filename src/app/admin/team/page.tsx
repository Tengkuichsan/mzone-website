"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
};

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    const res = await fetch("/api/team");
    if (res.ok) {
      const data = await res.json();
      setTeam(data);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !selectedFile) {
      alert("Harap isi nama, jabatan, dan pilih foto");
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

      // 2. Save to Team
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, imageUrl })
      });
      
      if (res.ok) {
        setName("");
        setRole("");
        setSelectedFile(null);
        const fileInput = document.getElementById("teamFile") as HTMLInputElement;
        if(fileInput) fileInput.value = "";
        
        fetchTeam();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota tim ini?")) return;
    
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTeam();
      }
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Master Data Tim</h1>
      
      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "800px", marginBottom: "30px" }}>
        <h3 style={{ marginBottom: "15px" }}>Tambah Anggota Tim Baru</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Jabatan / Posisi</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Production Manager"
                required
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Foto (Otomatis Kompresi ke PNG)</label>
            <input 
              id="teamFile"
              type="file" 
              accept="image/*"
              required
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: "flex-start", marginTop: "10px" }}>
            {loading ? "Menyimpan Data..." : "Tambahkan Anggota Tim"}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "15px 20px", width: "100px" }}>Foto</th>
              <th style={{ padding: "15px 20px" }}>Nama</th>
              <th style={{ padding: "15px 20px" }}>Jabatan</th>
              <th style={{ padding: "15px 20px", textAlign: "center", width: "100px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "var(--color-silver)" }}>
                  Daftar tim masih kosong.
                </td>
              </tr>
            ) : (
              team.map(member => (
                <tr key={member.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "15px 20px" }}>
                    <img src={member.imageUrl} alt={member.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%" }} />
                  </td>
                  <td style={{ padding: "15px 20px", fontWeight: "bold" }}>{member.name}</td>
                  <td style={{ padding: "15px 20px", color: "var(--color-silver)" }}>{member.role}</td>
                  <td style={{ padding: "15px 20px", textAlign: "center" }}>
                    <button onClick={() => handleDelete(member.id)} style={{ background: "none", border: "none", color: "#ff5555", cursor: "pointer" }}>
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
