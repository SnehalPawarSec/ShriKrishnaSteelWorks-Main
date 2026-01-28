import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

import Profile from "@/pages/Profile";
import Address from "@/pages/Address";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminProducts from "@/admin/AdminProducts";
import AdminProjects from "@/admin/AdminProjects";
import AdminRoute from "@/admin/AdminRoute";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/address" element={<Address />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
                {/* ✅ ADMIN ROUTE */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* ❗ MUST ALWAYS BE LAST */}
                <Route path="*" element={<NotFound />} />
                <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  }
/>
<Route
  path="/admin/projects"
  element={
    <AdminRoute>
      <AdminProjects />
    </AdminRoute>
  }
/>

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
