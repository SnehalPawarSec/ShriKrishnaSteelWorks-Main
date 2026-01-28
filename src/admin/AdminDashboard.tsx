import React, { useState } from 'react';
import AdminLayout from "./AdminLayout";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, Briefcase, Users, DollarSign, Edit2, Trash2, Plus } from 'lucide-react';
import { useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

type ProductSpec = {
  key: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
  image: string;
  description: string;
  specifications?: ProductSpec[];
};

type Order = {
  id: string;
  product: string;
  client: string;
  amount: number;
  date: string;
  status: string;
};

type Project = {
  id: string;
  name: string;
  client: string;
  progress: number;
  budget: string;
  status: string;
};

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null,
    imagePreview: '',
    specifications: [] as ProductSpec[],
  });

  // ✅ REAL-TIME LISTENERS (AUTO UPDATE ON ANY CHANGE)
  useEffect(() => {
    // PRODUCTS (Real-time)
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            price: data.price || "",
            stock: Number(data.stock) || 0,
            category: data.category || "",
            image: data.image || "",
            description: data.description || "",
            specifications: data.specifications || [],
          };
        });
        setProducts(list);
      },
      (error) => console.error("Products listener error:", error)
    );

    // USERS (Real-time)
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setTotalUsers(snapshot.size);
      },
      (error) => console.error("Users listener error:", error)
    );

    // PROJECTS (Real-time)
    const unsubProjects = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const allProjects: Project[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name || "",
          client: docSnap.data().client || "",
          progress: docSnap.data().progress || 0,
          budget: docSnap.data().budget || "",
          status: docSnap.data().status || "",
        }));

        // Count active projects
        const active = allProjects.filter(p => p.status === "In Progress");
        setActiveProjects(active.length);
        setProjectsList(allProjects);

        // Calculate project status data
        const statusCounts = {
          'Completed': 0,
          'In Progress': 0,
          'Pending': 0,
          'Delayed': 0,
        };
        allProjects.forEach(project => {
          const status = project.status || 'Pending';
          if (status in statusCounts) {
            statusCounts[status]++;
          }
        });
        setProjectStatusData([
          { name: 'Completed', value: statusCounts['Completed'], color: '#10b981' },
          { name: 'In Progress', value: statusCounts['In Progress'], color: '#3b82f6' },
          { name: 'Pending', value: statusCounts['Pending'], color: '#f59e0b' },
          { name: 'Delayed', value: statusCounts['Delayed'], color: '#ef4444' },
        ]);
      },
      (error) => console.error("Projects listener error:", error)
    );

    // ORDERS (Real-time) - Also updates revenue & chart
    const unsubOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        let revenue = 0;
        const ordersList: Order[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const amount = Number(data.amount) || 0;
          revenue += amount;
          ordersList.push({
            id: docSnap.id,
            product: data.product || "",
            client: data.client || "",
            amount: amount,
            date: data.date || new Date().toISOString().split("T")[0],
            status: data.status || "Pending",
          });
        });

        setTotalRevenue(revenue);
        setOrders(ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        // BUILD REVENUE CHART DATA (GROUP BY MONTH)
        const monthlyRevenue = {};
        ordersList.forEach((order) => {
          const date = new Date(order.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          const monthName = new Date(date.getFullYear(), date.getMonth()).toLocaleString("default", { month: "short" });

          if (!monthlyRevenue[monthKey]) {
            monthlyRevenue[monthKey] = { month: monthName, revenue: 0, orders: 0 };
          }
          monthlyRevenue[monthKey].revenue += order.amount;
          monthlyRevenue[monthKey].orders += 1;
        });

        const chartData = Object.values(monthlyRevenue).slice(-6);
        if (chartData.length === 0) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
          setRevenueData(months.map((month) => ({ month, revenue: 0, orders: 0 })));
        } else {
          setRevenueData(chartData as any);
        }
      },
      (error) => console.error("Orders listener error:", error)
    );

    // CLEANUP: Unsubscribe from all listeners when component unmounts
    return () => {
      unsubProducts();
      unsubUsers();
      unsubProjects();
      unsubOrders();
    };
  }, []);

  // ✅ STATS FROM REAL DATABASE
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Active Projects', 
      value: activeProjects.toString(), 
      icon: Briefcase, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Total Products', 
      value: products.length.toString(), 
      icon: Package, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Total Users', 
      value: totalUsers.toString(), 
      icon: Users, 
      color: 'bg-orange-500' 
    },
  ];

  // Helper Functions
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      image: null,
      imagePreview: product.image,
      specifications: product.specifications || [],
    });
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: null,
      imagePreview: '',
      specifications: [],
    });
    setShowProductModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    let imageURL = formData.imagePreview;

    if (formData.image) {
      const imageRef = ref(
        storage,
        `products/${Date.now()}_${formData.image.name}`
      );
      await uploadBytes(imageRef, formData.image);
      imageURL = await getDownloadURL(imageRef);
    }

    if (editingProduct) {
      await updateDoc(doc(db, "products", editingProduct.id), {
        name: formData.name,
        price: formData.price,
        stock: Number(formData.stock),
        category: formData.category,
        description: formData.description,
        image: imageURL,
        specifications: formData.specifications,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "products"), {
        name: formData.name,
        price: formData.price,
        stock: Number(formData.stock),
        category: formData.category,
        description: formData.description,
        image: imageURL,
        specifications: formData.specifications,
        createdAt: serverTimestamp(),
      });
    }

    setShowProductModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      image: null,
      imagePreview: "",
      specifications: [],
    });

    // ✅ No manual fetch needed - onSnapshot will auto-update
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    // ✅ No manual fetch needed - onSnapshot will auto-update
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage products, projects, orders, and platform data.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setSelectedSection('overview')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            selectedSection === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedSection('projects')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            selectedSection === 'projects'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setSelectedSection('orders')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            selectedSection === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setSelectedSection('products')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            selectedSection === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Products
        </button>
      </div>

      {/* OVERVIEW SECTION */}
      {selectedSection === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue & Orders Trend</h3>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue (₹)" />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No order data available
                </div>
              )}
            </div>

            {/* Project Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Status</h3>
              {projectStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                      {projectStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No project data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            </div>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-gray-600">{order.product}</td>
                        <td className="px-6 py-4 text-gray-600">{order.client}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">₹{order.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No orders available</div>
            )}
          </div>
        </div>
      )}

      {/* PROJECTS SECTION */}
      {selectedSection === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
          </div>
          {projectsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectsList.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Budget: <span className="font-medium text-gray-900">{project.budget}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              No projects available
            </div>
          )}
        </div>
      )}

      {/* ORDERS SECTION */}
      {selectedSection === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
          </div>
          {orders.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-gray-600">{order.product}</td>
                      <td className="px-6 py-4 text-gray-600">{order.client}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">₹{order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              No orders available
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS SECTION */}
      {selectedSection === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
            <button 
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <Package size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-gray-900">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-medium ${product.stock > 100 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {product.stock} units
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products</h3>
              <p className="text-gray-600 mb-4">Start by adding your first product</p>
              <button 
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Product
              </button>
            </div>
          )}

          {/* Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                      />
                      <label htmlFor="imageInput" className="cursor-pointer block">
                        {formData.imagePreview ? (
                          <div className="space-y-2">
                            <img 
                              src={formData.imagePreview} 
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <p className="text-sm text-blue-600">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Package size={48} className="mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload product image</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Name <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Category & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Category <span className="text-red-600">*</span></label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        <option value="Structural Steel">Structural Steel</option>
                        <option value="Reinforcement">Reinforcement</option>
                        <option value="Roofing">Roofing</option>
                        <option value="Fasteners">Fasteners</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Price <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Stock Quantity <span className="text-red-600">*</span></label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-900">Product Specifications</label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            specifications: [...(formData.specifications || []), { key: '', value: '' }]
                          });
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                      >
                        + Add Spec
                      </button>
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                      {formData.specifications && formData.specifications.length > 0 ? (
                        formData.specifications.map((spec, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g., Material, Colour, Brand"
                              value={spec.key}
                              onChange={(e) => {
                                const newSpecs = [...(formData.specifications || [])];
                                newSpecs[index].key = e.target.value;
                                setFormData({ ...formData, specifications: newSpecs });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="e.g., Stainless Steel, Silver"
                              value={spec.value}
                              onChange={(e) => {
                                const newSpecs = [...(formData.specifications || [])];
                                newSpecs[index].value = e.target.value;
                                setFormData({ ...formData, specifications: newSpecs });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = formData.specifications?.filter((_, i) => i !== index) || [];
                                setFormData({ ...formData, specifications: newSpecs });
                              }}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No specifications added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-gray-50">
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;