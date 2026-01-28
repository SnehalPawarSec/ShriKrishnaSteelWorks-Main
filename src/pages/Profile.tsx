import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: any;
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 🔐 Protect route
  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user]);

  // 👤 Load user profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setName(snap.data().name || "");
      }
    };

    fetchProfile();
  }, [user]);

  // 📦 Load orders
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(data);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user]);

  // 💾 Update profile
  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
      });

      // Update navbar instantly
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          displayName: name,
        })
      );
      window.dispatchEvent(new Event("userChanged"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-10">My Profile</h1>

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white shadow rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-muted-foreground">
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Email
              </label>
              <Input value={user?.email || ""} disabled />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* ================= ORDERS ================= */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">My Orders</h2>

          {loadingOrders && <p>Loading orders...</p>}

          {!loadingOrders && orders.length === 0 && (
            <p className="text-muted-foreground">
              You have not placed any orders yet.
            </p>
          )}

          {!loadingOrders && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3">Order ID</th>
                    <th className="text-left py-3">Total</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">{order.id.slice(0, 8)}...</td>
                      <td className="py-3">₹{order.total}</td>
                      <td className="py-3 capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {order.createdAt?.toDate?.().toLocaleDateString?.() ||
                          "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
