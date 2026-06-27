import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar"; // Assuming we have or will create this, or we just rely on page layout. Let's build a simple catalog view
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import clsx from "clsx";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  const waSetting = await prisma.settings.findUnique({
    where: { key: "whatsapp_number" }
  });

  const waNumber = waSetting?.value || "6281234567890"; // Fallback number

  return (
    <main style={{ backgroundColor: "var(--color-black)", minHeight: "100vh", color: "white" }}>
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "50px" }}>
          <Link href="/" style={{ color: "var(--color-silver)", textDecoration: "none" }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ fontSize: "2.5rem" }}>Katalog <span style={{ color: "var(--color-maroon)" }}>Lengkap</span></h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px" }}>
          {products.length === 0 ? (
            <p style={{ color: "var(--color-silver)" }}>Belum ada produk di katalog.</p>
          ) : (
            products.map((product) => {
              const waText = encodeURIComponent(`Halo MZone, saya tertarik untuk memesan produk ${product.name}. Bisakah saya mendapatkan informasi lebih lanjut?`);
              const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

              return (
                <div key={product.id} style={{ backgroundColor: "rgba(25,25,25,0.8)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", height: "300px", width: "100%" }}>
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "25px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{product.name}</h3>
                      <span style={{ backgroundColor: "rgba(110, 15, 27, 0.2)", color: "var(--color-maroon)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                        {product.category}
                      </span>
                    </div>
                    <p style={{ color: "var(--color-silver)", fontSize: "0.9rem", marginBottom: "20px", flex: 1, lineHeight: "1.6" }}>
                      {product.description}
                    </p>
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "var(--color-silver)" }}>Harga</span>
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-white)" }}>{product.price}</span>
                    </div>
                    
                    <a 
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" }}
                    >
                      <MessageCircle size={18} /> Pesan via WhatsApp
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
