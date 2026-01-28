/**
 * 🔥 WARNING:
 * This script DELETES ALL DATA from Firestore
 * and inserts fresh dummy data.
 */

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // adjust path if needed

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
      name: "TMT Steel Bars 12mm",
      price: "850",
      stock: 500,
      category: "Reinforcement",
      image: "",
      description: "High-strength TMT bars for construction reinforcement",
      specifications: [
        { key: "Material", value: "Steel" },
        { key: "Grade", value: "Fe 500" },
        { key: "Standard", value: "IS 1786" },
        { key: "Tensile Strength", value: "500 MPa" }
      ]
    },
    {
      name: "Structural Steel Beams",
      price: "1200",
      stock: 300,
      category: "Structural Steel",
      image: "",
      description: "Heavy-duty structural steel beams for industrial construction",
      specifications: [
        { key: "Material", value: "Structural Steel" },
        { key: "Type", value: "I-Section" },
        { key: "Standard", value: "IS 808" },
        { key: "Yield Strength", value: "250 MPa" }
      ]
    },
    {
      name: "Roofing Sheets Galvanized",
      price: "450",
      stock: 1000,
      category: "Roofing",
      image: "",
      description: "Durable galvanized roofing sheets for residential & commercial use",
      specifications: [
        { key: "Material", value: "Galvanized Steel" },
        { key: "Coating", value: "Zinc Plated" },
        { key: "Thickness", value: "0.8 mm" },
        { key: "Width", value: "750-1000 mm" }
      ]
    },
    {
      name: "Structural Angles L-Section",
      price: "950",
      stock: 400,
      category: "Structural Steel",
      image: "",
      description: "L-shaped structural angles for framework construction",
      specifications: [
        { key: "Material", value: "Structural Steel" },
        { key: "Type", value: "Equal Angles" },
        { key: "Standard", value: "IS 1761" },
        { key: "Yield Strength", value: "250 MPa" }
      ]
    },
    {
      name: "Steel Fasteners & Bolts",
      price: "150",
      stock: 2000,
      category: "Fasteners",
      image: "",
      description: "High-quality steel bolts, nuts, and fasteners",
      specifications: [
        { key: "Material", value: "Carbon Steel" },
        { key: "Grade", value: "8.8" },
        { key: "Standard", value: "ISO 4016" },
        { key: "Surface Finish", value: "Zinc Plated" }
      ]
    },
    {
      name: "Channel Steel C-Section",
      price: "1100",
      stock: 250,
      category: "Structural Steel",
      image: "",
      description: "C-shaped channel steel for structural support",
      specifications: [
        { key: "Material", value: "Structural Steel" },
        { key: "Type", value: "Channel Section" },
        { key: "Standard", value: "IS 808" },
        { key: "Weight", value: "Varies by size" }
      ]
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
