import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-700">
            Shri Krishna Steel Works
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <Link to="/projects" className="hover:text-blue-600">Projects</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>

            {/* Auth Section */}
            {!user ? (
              <Button onClick={() => navigate("/auth")}>
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  👤 {user.displayName || user.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1">{children}</main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Shri Krishna Steel Works
      </footer>
    </div>
  );
};

export default Layout;
