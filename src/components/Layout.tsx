import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // 🔹 Load & sync user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    // listen for login/logout changes
    window.addEventListener('storage', loadUser);
    window.addEventListener('userChanged', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userChanged', loadUser);
    };
  }, []);

  // 🔹 Logout handler (shared with Navbar)
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    setUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ Navbar unchanged visually, just receives props */}
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        {children}
      </main>
      
      {/* Footer (UNCHANGED) */}
      <footer className="text-gray-300 py-12 bg-footer-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4">
                Shri krishna steel works
              </h3>
              <p className="text-sm">
                Crafting excellence in steel fabrication. From structural beams to custom gates, 
                we deliver durable and reliable solutions for your project needs.
              </p>
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  Pune-Banglor Highway, <br />
                  Near Hotel Annapurna, <br />
                  Gote, Tal.Karad, Dist. Satara
                </li>
                <li>Email: shrikrishnasteel0809@gmail.com</li>
                <li>Phone: +91 9226133650</li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/products" className="hover:text-white">Products</a></li>
                <li><a href="/projects" className="hover:text-white">Projects</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#"><Facebook size={24} /></a>
                <a href="#"><Twitter size={24} /></a>
                <a href="#"><Linkedin size={24} /></a>
                <a href="#"><Instagram size={24} /></a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Shri krishna steel works. 
              All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
