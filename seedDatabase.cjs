/**
 * 🔥 WARNING:
 * This script DELETES ALL DATA from Firestore
 * and inserts fresh dummy data.
 */

const admin = require("firebase-admin");
const serviceAccount = require("../ShriKrishnaSteelWorks-main/serviceAccountKey.json"); // adjust path if needed

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ==============================
// 🔥 DELETE COLLECTION
// ==============================
async function deleteCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`🗑️ Deleted collection: ${collectionName}`);
}

// ==============================
// 🌱 SEED USERS
// ==============================
async function seedUsers() {
  const users = [
    { name: "Admin User", email: "admin@sksteel.com", role: "admin" },
    { name: "Snehal Pawar", email: "snehal@gmail.com", role: "client" },
    { name: "Rahul Sharma", email: "rahul@gmail.com", role: "client" },
  ];

  for (const user of users) {
    await db.collection("users").add({
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("✅ Users seeded");
}

// ==============================
// 🌱 SEED PRODUCTS
// ==============================
async function seedProducts() {
  const products = [
    {
      name: "Steel Beams (I-Section)",
      price: "50000",
      stock: 120,
      category: "Structural Steel",
      image: "",
      description: "High-quality I-section beams",
    },
    {
      name: "TMT Bars",
      price: "30000",
      stock: 250,
      category: "Reinforcement",
      image: "",
      description: "Thermo-mechanically treated bars",
    },
    {
      name: "Roofing Sheets",
      price: "15000",
      stock: 500,
      category: "Roofing",
      image: "",
      description: "Corrugated roofing sheets",
    },
  ];

  for (const product of products) {
    await db.collection("products").add({
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("✅ Products seeded");
}

// ==============================
// 🌱 SEED PROJECTS
// ==============================
async function seedProjects() {
  const projects = [
    {
      name: "Mumbai Commercial Complex",
      client: "Reliance Industries",
      status: "In Progress",
      progress: 75,
      budget: 5000000,
    },
    {
      name: "Pune Industrial Warehouse",
      client: "Bajaj Auto",
      status: "In Progress",
      progress: 40,
      budget: 3200000,
    },
    {
      name: "Aurangabad Steel Plant",
      client: "Tata Steel",
      status: "Completed",
      progress: 100,
      budget: 8000000,
    },
  ];

  for (const project of projects) {
    await db.collection("projects").add({
      ...project,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("✅ Projects seeded");
}

// ==============================
// 🌱 SEED ORDERS (FOR OVERVIEW)
// ==============================
async function seedOrders() {
  const orders = [
    { amount: 25000, status: "Completed" },
    { amount: 18500, status: "Pending" },
    { amount: 32000, status: "In Progress" },
    { amount: 21000, status: "Completed" },
    { amount: 15500, status: "Pending" },
  ];

  for (const order of orders) {
    await db.collection("orders").add({
      ...order,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("✅ Orders seeded");
}

// ==============================
// 🚀 MAIN EXECUTION
// ==============================
(async () => {
  try {
    console.log("🔥 RESETTING DATABASE...");

    await deleteCollection("users");
    await deleteCollection("products");
    await deleteCollection("projects");
    await deleteCollection("orders");

    console.log("🌱 SEEDING DATA...");

    await seedUsers();
    await seedProducts();
    await seedProjects();
    await seedOrders();

    console.log("🎉 DATABASE RESET & SEEDED SUCCESSFULLY");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
})();
