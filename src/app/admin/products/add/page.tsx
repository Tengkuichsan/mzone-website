"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Plus } from "lucide-react";

type ColorSwatch = { name: string; hex: string };

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  
  // Images
  const [mainFiles, setMainFiles] = useState<File[]>([]);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  // Colors
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");

  // Sizes & Materials
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");

  const [materials, setMaterials] = useState<string[]>([]);
  const [materialInput, setMaterialInput] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const isJersey = formData.category.toLowerCase().includes("jersey");

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (mainFiles.length + filesArray.length > 2) {
        alert("Gambar Utama maksimal 2 (Tampak Depan & Belakang).");
        return;
      }
      setMainFiles([...mainFiles, ...filesArray]);
    }
  };

  const handleDetailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (detailFiles.length + filesArray.length > 3) {
        alert("Gambar Detail Samping maksimal 3.");
        return;
      }
      setDetailFiles([...detailFiles, ...filesArray]);
    }
  };

  const addTag = (type: "size" | "material", e: React.KeyboardEvent | React.FocusEvent) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'blur') {
      e.preventDefault();
      if (type === "size" && sizeInput.trim()) {
        if (!sizes.includes(sizeInput.trim())) setSizes([...sizes, sizeInput.trim()]);
        setSizeInput("");
      } else if (type === "material" && materialInput.trim()) {
        if (!materials.includes(materialInput.trim())) setMaterials([...materials, materialInput.trim()]);
        setMaterialInput("");
      }
    }
  };

  const addColor = () => {
    if (colorNameInput.trim()) {
      setColors([...colors, { name: colorNameInput.trim(), hex: colorHexInput }]);
      setColorNameInput("");
    }
  };

  const removeTag = (type: "color" | "size" | "material", index: number) => {
    if (type === "color") {
      const newArr = [...colors]; newArr.splice(index, 1); setColors(newArr);
    } else if (type === "size") {
      const newArr = [...sizes]; newArr.splice(index, 1); setSizes(newArr);
    } else if (type === "material") {
      const newArr = [...materials]; newArr.splice(index, 1); setMaterials(newArr);
    }
  };

  const removeFile = (type: "main" | "detail", index: number) => {
    if (type === "main") {
      const newArr = [...mainFiles]; newArr.splice(index, 1); setMainFiles(newArr);
    } else {
      const newArr = [...detailFiles]; newArr.splice(index, 1); setDetailFiles(newArr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mainFiles.length === 0) {
      alert("Harap pilih minimal 1 Gambar Utama (Tampak Depan).");
      return;
    }

    setLoading(true);

    try {
      const uploadMultiple = async (files: File[]) => {
        const urls: string[] = [];
        for (const file of files) {
          const uploadData = new FormData();
          uploadData.append("file", file);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
          if (!uploadRes.ok) throw new Error("Gagal mengunggah gambar");
          const { url } = await uploadRes.json();
          urls.push(url);
        }
        return urls;
      };

      const uploadedMain = await uploadMultiple(mainFiles);
      const uploadedDetail = await uploadMultiple(detailFiles);

      // Construct images object
      const imagesObject = {
        front: uploadedMain[0] || "",
        back: uploadedMain[1] || uploadedMain[0] || "", // Fallback to front if no back
        details: uploadedDetail
      };

      const productData = { 
        ...formData, 
        images: imagesObject,
        colors: colors,
        sizes: sizes,
        materials: isJersey ? materials : []
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
      console.error(err);
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
              type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
            />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Kategori</label>
              <select 
                required value={formData.category}
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
                type="text" required placeholder="Contoh: Mulai dari Rp 50.000" value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* Color Picker Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Warna & Kode Hex</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input type="color" value={colorHexInput} onChange={(e) => setColorHexInput(e.target.value)} style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "6px", cursor: "pointer" }} />
                <input type="text" placeholder="Nama Warna (Cth: Merah Maroon)" value={colorNameInput} onChange={(e) => setColorNameInput(e.target.value)} style={{ flex: 1, padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }} />
                <button type="button" onClick={addColor} style={{ padding: "12px", backgroundColor: "var(--color-maroon)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}><Plus size={18}/></button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {colors.map((c, idx) => (
                  <span key={idx} style={{ backgroundColor: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "20px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: c.hex }}></span>
                    {c.name}
                    <button type="button" onClick={() => removeTag("color", idx)} style={{ background: "none", border: "none", color: "var(--color-silver)", cursor: "pointer", display: "flex", padding: 0 }}><X size={14}/></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Pilihan Ukuran (Tekan Enter)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "8px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", minHeight: "45px" }}>
                {sizes.map((s, idx) => (
                  <span key={idx} style={{ backgroundColor: "var(--color-maroon)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {s}
                    <button type="button" onClick={() => removeTag("size", idx)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", padding: 0 }}><X size={14}/></button>
                  </span>
                ))}
                <input type="text" placeholder="Ketik & Enter..." value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => addTag("size", e)} onBlur={(e) => addTag("size", e)} style={{ background: "transparent", border: "none", color: "white", outline: "none", flex: 1, minWidth: "120px" }} />
              </div>
            </div>

            {isJersey && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Pilihan Bahan (Tekan Enter)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "8px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", minHeight: "45px" }}>
                  {materials.map((m, idx) => (
                    <span key={idx} style={{ backgroundColor: "var(--color-maroon)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                      {m}
                      <button type="button" onClick={() => removeTag("material", idx)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", padding: 0 }}><X size={14}/></button>
                    </span>
                  ))}
                  <input type="text" placeholder="Drifit, dll (Enter)" value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} onKeyDown={(e) => addTag("material", e)} onBlur={(e) => addTag("material", e)} style={{ background: "transparent", border: "none", color: "white", outline: "none", flex: 1, minWidth: "120px" }} />
                </div>
              </div>
            )}
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

          <div style={{ display: "flex", gap: "20px" }}>
            {/* Main Images */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>
                <span style={{ color: "white", fontWeight: "bold" }}>Gambar Utama (Maks 2)</span><br/>
                Urutan: 1. Depan, 2. Belakang
              </label>
              <input type="file" accept="image/*" multiple onChange={handleMainFileChange} style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }} />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {mainFiles.map((f, i) => (
                  <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <img src={URL.createObjectURL(f)} alt="Prev" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => removeFile("main", i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Images */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>
                <span style={{ color: "white", fontWeight: "bold" }}>Gambar Detail Samping (Maks 3)</span><br/>
                Detail Kerah, Jahitan, Bahan, dll
              </label>
              <input type="file" accept="image/*" multiple onChange={handleDetailFileChange} style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white" }} />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {detailFiles.map((f, i) => (
                  <div key={i} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <img src={URL.createObjectURL(f)} alt="Prev" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => removeFile("detail", i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "10px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: "var(--color-silver)", fontSize: "0.9rem" }}>Deskripsi Produk</label>
            <textarea 
              required rows={4} value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: "12px", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "white", resize: "vertical" }}
            />
          </div>

          <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={loading} style={{ marginTop: "10px", width: "100%" }}>
            {loading ? "Menyimpan & Mengompres Gambar..." : "Simpan Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}
