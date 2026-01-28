import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link to="/admin" className="block hover:text-blue-400">Dashboard</Link>
          <Link to="/admin/products" className="block hover:text-blue-400">Products</Link>
          <Link to="/admin/projects" className="block hover:text-blue-400">Projects</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
};

export default AdminLayout;
