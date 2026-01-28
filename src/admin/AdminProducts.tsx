import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { addProduct } from "@/lib/adminService";

const AdminProducts = () => {
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) return alert("Select image");
    await addProduct(form, file);
    alert("Product added");
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      <input
        placeholder="Name"
        className="border p-2 w-full mb-2"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Price"
        className="border p-2 w-full mb-2"
        onChange={e => setForm({ ...form, price: e.target.value })}
      />
      <input
        placeholder="Category"
        className="border p-2 w-full mb-2"
        onChange={e => setForm({ ...form, category: e.target.value })}
      />
      <input
        type="file"
        className="mb-4"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        Upload Product
      </button>
    </AdminLayout>
  );
};

export default AdminProducts;
