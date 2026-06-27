"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, RefreshCw, CheckCircle, XCircle } from "lucide-react";

export default function AdminIntegrationsPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "idle">("idle");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      const apiUrlSetting = data.find((s: any) => s.key === "external_api_url");
      const apiKeySetting = data.find((s: any) => s.key === "external_api_key");
      
      if (apiUrlSetting) setApiUrl(apiUrlSetting.value);
      if (apiKeySetting) setApiKey(apiKeySetting.value);
    } catch (error) {
      console.error("Failed to load settings");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Save URL
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "external_api_url", value: apiUrl }),
      });
      // Save Key
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "external_api_key", value: apiKey }),
      });

      setMessage({ text: "Pengaturan integrasi berhasil disimpan!", type: "success" });
    } catch (error) {
      setMessage({ text: "Gagal menyimpan pengaturan.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!apiUrl) {
      setMessage({ text: "Masukkan API URL terlebih dahulu.", type: "error" });
      return;
    }
    
    setConnectionStatus("checking");
    setMessage({ text: "", type: "" });
    
    try {
      // We will create an endpoint to test this connection from the server-side to avoid CORS
      const res = await fetch("/api/track-po?test=true");
      const data = await res.json();
      
      if (res.ok && data.success) {
        setConnectionStatus("connected");
        setMessage({ text: "Koneksi ke sistem eksternal berhasil!", type: "success" });
      } else {
        setConnectionStatus("disconnected");
        setMessage({ text: "Gagal terhubung: " + (data.error || "Endpoint tidak valid"), type: "error" });
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      setMessage({ text: "Gagal terhubung ke sistem eksternal. Periksa URL Anda.", type: "error" });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "8px" }}>Integrasi Sistem Eksternal (API)</h1>
        <p style={{ color: "var(--color-silver)" }}>Hubungkan MZone Garment dengan sistem ERP/Admin lain Anda.</p>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "800px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#fff" }}>Pengaturan API Koneksi PO</h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", padding: "6px 12px", borderRadius: "20px", backgroundColor: connectionStatus === "connected" ? "rgba(34, 197, 94, 0.1)" : connectionStatus === "disconnected" ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.1)", color: connectionStatus === "connected" ? "#4ade80" : connectionStatus === "disconnected" ? "#f87171" : "#a1a1aa" }}>
            {connectionStatus === "connected" && <CheckCircle size={16} />}
            {connectionStatus === "disconnected" && <XCircle size={16} />}
            {connectionStatus === "checking" && <RefreshCw size={16} />}
            {connectionStatus === "idle" && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#a1a1aa" }}></div>}
            <span>
              {connectionStatus === "connected" ? "Terhubung" : 
               connectionStatus === "disconnected" ? "Terputus" : 
               connectionStatus === "checking" ? "Mengecek..." : "Status: Tidak Diketahui"}
            </span>
          </div>
        </div>

        {message.text && (
          <div style={{ marginBottom: "20px", padding: "12px", borderRadius: "8px", backgroundColor: message.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: message.type === "success" ? "#4ade80" : "#f87171", border: `1px solid ${message.type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}` }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>API Endpoint URL</label>
            <input
              type="url"
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white", width: "100%" }}
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://erp.perusahaananda.com/api/po-status"
              required
            />
            <p style={{ fontSize: "0.8rem", color: "#a1a1aa", marginTop: "4px" }}>
              URL endpoint dari sistem eksternal yang merespon permintaan status PO (mendukung GET parameter ?po_number=...). Kosongkan atau gunakan URL dummy jika ingin menggunakan simulasi data (mockup).
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>API Key / Secret Token (Opsional)</label>
            <input
              type="password"
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white", width: "100%" }}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
            />
            <p style={{ fontSize: "0.8rem", color: "#a1a1aa", marginTop: "4px" }}>
              Token keamanan untuk mengakses API eksternal Anda (akan dikirim via header Authorization).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1, border: "none" }}
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={testConnection}
              disabled={loading || connectionStatus === "checking"}
              style={{ backgroundColor: "#3f3f46", color: "white", flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", border: "none" }}
            >
              <LinkIcon size={18} /> Test Koneksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
