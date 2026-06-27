"use client";

import React, { useState, useEffect } from "react";
import styles from "../admin.module.css";

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState("");
  const [savingWa, setSavingWa] = useState(false);
  const [messageWa, setMessageWa] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [messagePass, setMessagePass] = useState("");

  useEffect(() => {
    fetch("/api/settings?key=whatsapp_number")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (data && data.value) setWaNumber(data.value);
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handleSaveWa = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWa(true);
    setMessageWa("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "whatsapp_number", value: waNumber })
      });
      
      if (res.ok) {
        setMessageWa("Pengaturan WhatsApp berhasil disimpan!");
      } else {
        setMessageWa("Gagal menyimpan pengaturan WhatsApp.");
      }
    } catch (err) {
      setMessageWa("Terjadi kesalahan koneksi.");
    } finally {
      setSavingWa(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPass(true);
    setMessagePass("");
    
    if (newPassword.length < 6) {
      setMessagePass("Password minimal 6 karakter.");
      setSavingPass(false);
      return;
    }
    
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword })
      });
      
      if (res.ok) {
        setMessagePass("Password berhasil diubah!");
        setNewPassword(""); // Clear field
      } else {
        const data = await res.json();
        setMessagePass(data.message || "Gagal mengubah password.");
      }
    } catch (err) {
      setMessagePass("Terjadi kesalahan koneksi.");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Pengaturan Web</h1>
      
      <div style={{ display: "grid", gap: "30px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* WhatsApp Settings */}
        <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "20px" }}>Nomor WhatsApp Admin</h3>
          <p style={{ color: "var(--color-silver)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Masukkan nomor WhatsApp tanpa angka 0 di depan, gunakan kode negara (contoh: 6281234567890).
          </p>
          
          <form onSubmit={handleSaveWa} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            
            <button type="submit" className="btn btn-primary" disabled={savingWa}>
              {savingWa ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            
            {messageWa && <p style={{ color: messageWa.includes("berhasil") ? "var(--color-primary)" : "var(--color-maroon)", fontWeight: "bold" }}>{messageWa}</p>}
          </form>
        </div>

        {/* Change Password */}
        <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "20px" }}>Ubah Password Admin</h3>
          <p style={{ color: "var(--color-silver)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Ganti password login Anda secara berkala untuk menjaga keamanan website.
          </p>
          
          <form onSubmit={handleSavePassword} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="Password Baru"
              required
              minLength={6}
              style={{ 
                padding: "12px 15px", 
                backgroundColor: "rgba(0,0,0,0.5)", 
                border: "1px solid rgba(255,255,255,0.2)", 
                borderRadius: "6px", 
                color: "white",
                width: "100%"
              }}
            />
            
            <button type="submit" className="btn btn-primary" disabled={savingPass}>
              {savingPass ? "Menyimpan..." : "Ubah Password"}
            </button>
            
            {messagePass && <p style={{ color: messagePass.includes("berhasil") ? "var(--color-primary)" : "var(--color-maroon)", fontWeight: "bold" }}>{messagePass}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
