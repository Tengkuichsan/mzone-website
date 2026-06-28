import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import DeleteButton from "./DeleteButton";

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Kelola Produk Katalog</h1>
        <Link href="/admin/products/add" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} /> Tambah Produk
        </Link>
      </div>

      <div style={{ backgroundColor: "rgba(25,25,25,0.8)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "15px 20px" }}>Gambar</th>
              <th style={{ padding: "15px 20px" }}>Nama Produk</th>
              <th style={{ padding: "15px 20px" }}>Kategori</th>
              <th style={{ padding: "15px 20px" }}>Harga</th>
              <th style={{ padding: "15px 20px", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "var(--color-silver)" }}>
                  Belum ada produk. Silakan tambah produk baru.
                </td>
              </tr>
            ) : (
              products.map(product => {
                const images = product.images as string[];
                const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : "/placeholder.png";
                return (
                <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "15px 20px" }}>
                    <img src={firstImage} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                  </td>
                  <td style={{ padding: "15px 20px", fontWeight: "bold" }}>{product.name}</td>
                  <td style={{ padding: "15px 20px", color: "var(--color-silver)" }}>{product.category}</td>
                  <td style={{ padding: "15px 20px", color: "var(--color-maroon)" }}>{product.price}</td>
                  <td style={{ padding: "15px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <Link href={`/admin/products/edit/${product.id}`} style={{ color: "var(--color-silver)" }}>
                        <Edit size={18} />
                      </Link>
                      {/* Note: In a real app, delete should be a form or API call, but we'll leave it as icon for now */}
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
