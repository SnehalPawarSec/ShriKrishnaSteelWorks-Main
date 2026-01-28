import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Address = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);

  // 🔐 Protect page
  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user]);

  // Load saved address
  useEffect(() => {
    if (!user) return;

    const loadAddress = async () => {
      const ref = doc(db, "addresses", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAddress(snap.data() as any);
      }
    };

    loadAddress();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    await setDoc(doc(db, "addresses", user.uid), {
      ...address,
      userId: user.uid,
    });

    setSaving(false);
    navigate("/profile"); // next logical step
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Delivery Address</h1>

        <div className="bg-white shadow rounded-xl p-6 grid md:grid-cols-2 gap-6">
          <Input
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          />
          <Input
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />
          <Input
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <Input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <Input
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <Input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save & Continue"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Address;
