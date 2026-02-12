import React, { useEffect, useState } from "react";
import { getProducts } from "@/lib/database";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
  stock?: number;
  specifications?: Array<{ key: string; value: string }>;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const categories = [
    { value: "all", label: "All Products" },
    { value: "structural", label: "Structural Steel" },
    { value: "custom", label: "Custom Fabrication" },
    { value: "industrial", label: "Industrial Components" },
    { value: "residential", label: "Residential Steel" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("🔥 PRODUCTS FROM FIRESTORE:", data);
        setProducts(data as Product[]);
      } catch (err) {
        console.error("❌ Firebase error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <Badge className="mb-4 bg-blue-500/20 text-blue-200 border-blue-400/30 px-4 py-2 text-sm font-medium">
            Our Products
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Premium Steel Fabrication Works
          </h1>
          <p className="text-lg text-blue-200">
            Innovative solutions for construction, infrastructure, and industrial projects.
          </p>
        </div>
      </section>

      <section className="py-12 bg-steel">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {loading && <p className="text-center">Loading products...</p>}

          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <p>No products found.</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-steel text-center">
        <Button size="lg" onClick={() => navigate("/contact")}>
          Request Custom Quote
        </Button>
      </section>
    </Layout>
  );
};

export default Products;
