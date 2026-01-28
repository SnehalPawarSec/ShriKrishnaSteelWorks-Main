// src/lib/database.ts

import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= PRODUCTS ================= */

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addProduct = async (data: any) => {
  await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

/* ================= ORDERS ================= */

export const OrderService = {
  createOrder: async (order: any) => {
    await addDoc(collection(db, "orders"), {
      ...order,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  },
};

export const calculateOrderTotal = (items: any[]) => {
  return items.reduce((total, item) => {
    const price = Number(item.price?.replace(/[^0-9]/g, "")) || 0;
    return total + price * (item.quantity || 1);
  }, 0);
};

/* ================= CONTACT ================= */

export const ContactService = {
  submitMessage: async (data: any) => {
    await addDoc(collection(db, "contacts"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },
};
