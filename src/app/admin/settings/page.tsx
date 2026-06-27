"use client";

import React, { useState, useEffect } from "react";
import styles from "../admin.module.css";

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings?key=whatsapp_number")
      .then(res => res.json())
      .then(data => {
        if (data.value) setWaNumber(data.value);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "whatsapp_number", value: waNumber })
      });
      
      if (res.ok) {
        setMessage("Pengaturan berhasil disimpan!");
      } else {
        setMessage("Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Pengaturan Web</h1>
      
      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "600px" }}>
        <h3 style={{ marginBottom: "20px" }}>Nomor WhatsApp Admin</h3>
        <p style={{ color: "var(--color-silver)", fontSize: "0.9rem", marginBottom: "20px" }}>
          Masukkan nomor WhatsApp tanpa angka 0 di depan, gunakan kode negara (contoh: 6281234567890).
        </p>
        
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input 
            type="text" 
            value={waNumber} 
            onChange={(e) => setWaNumber(e.target.value)} 
            placeholder="62812xxxxxx"
            required
            style={{ 
              padding: "12px 15px", 
              backgroundColor: "rgba(0,0,0,0.5)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              borderRadius: "6px", 
              color: "white",
              width: "100%"
            }}
          />
          
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
          
          {message && <p style={{ color: "var(--color-maroon)", fontWeight: "bold" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
