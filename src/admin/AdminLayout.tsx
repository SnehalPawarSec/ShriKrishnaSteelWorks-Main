import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3 flex-1">
          <Link to="/admin" className="block hover:text-blue-400 font-medium">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block hover:text-blue-400 font-medium">
            Products
          </Link>
          <Link to="/admin/projects" className="block hover:text-blue-400 font-medium">
            Projects
          </Link>
        </nav>

        {/* Bottom Navigation */}
        <div className="space-y-3 border-t border-gray-700 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2 text-gray-900" />
            <span className="text-gray-900">Back to Home</span>
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
};

export default AdminLayout;
