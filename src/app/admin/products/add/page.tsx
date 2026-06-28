"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        alert("Maksimal 5 gambar diperbolehkan.");
        return;
      }
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const addTag = (type: "color" | "size", e: React.KeyboardEvent | React.FocusEvent) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'blur') {
      e.preventDefault();
      if (type === "color" && colorInput.trim()) {
        if (!colors.includes(colorInput.trim())) {
          setColors([...colors, colorInput.trim()]);
        }
        setColorInput("");
      } else if (type === "size" && sizeInput.trim()) {
        if (!sizes.includes(sizeInput.trim())) {
          setSizes([...sizes, sizeInput.trim()]);
        }
        setSizeInput("");
      }
    }
  };

  const removeTag = (type: "color" | "size", index: number) => {
    if (type === "color") {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    } else {
      const newSizes = [...sizes];
      newSizes.splice(index, 1);
      setSizes(newSizes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Harap pilih setidaknya 1 gambar produk (Maks 5)");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Images
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData
        });
        
        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah gambar");
        }
        
        const { url } = await uploadRes.json();
        uploadedUrls.push(url);
      }

      // 2. Save Product
      const productData = { 
        ...formData, 
        images: uploadedUrls,
        colors: colors,
        sizes: sizes
      };
      
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
      alert("Terjadi kesalahan saat mengunggah atau menyimpan data.");
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }} onKeyDown={(e) => { if(e.key === 'Enter') e.preventDefault(); }}>
          
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

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Pilihan Warna (Tekan Enter)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "8px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", minHeight: "45px" }}>
                {colors.map((color, index) => (
                  <span key={index} style={{ backgroundColor: "var(--color-maroon)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {color}
                    <button type="button" onClick={() => removeTag("color", index)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", padding: 0 }}><X size={14}/></button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder="Ketik & Enter..."
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => addTag("color", e)}
                  onBlur={(e) => addTag("color", e)}
                  style={{ background: "transparent", border: "none", color: "white", outline: "none", flex: 1, minWidth: "120px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Pilihan Ukuran (Tekan Enter)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "8px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", minHeight: "45px" }}>
                {sizes.map((size, index) => (
                  <span key={index} style={{ backgroundColor: "var(--color-maroon)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {size}
                    <button type="button" onClick={() => removeTag("size", index)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", padding: 0 }}><X size={14}/></button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder="Ketik & Enter..."
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={(e) => addTag("size", e)}
                  onBlur={(e) => addTag("size", e)}
                  style={{ background: "transparent", border: "none", color: "white", outline: "none", flex: 1, minWidth: "120px" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Galeri Gambar (Bisa pilih sampai 5 gambar sekaligus)</label>
            <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
            />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {selectedFiles.map((file, index) => (
                <div key={index} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => removeFile(index)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </div>
            <small style={{ color: "var(--color-silver)" }}>Gambar pertama (kiri) akan menjadi gambar utama.</small>
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

          <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Menyimpan & Mengompres Gambar..." : "Simpan Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}
