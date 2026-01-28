// seedOverview.cjs

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedOverview() {
  // PRODUCTS
  const products = [
    {
      name: "Steel Beams (I-Section)",
      price: "₹50,000",
      stock: 120,
      category: "Structural Steel",
      image: "/images/steel-beams.jpg",
      description: "High-quality I-section steel beams",
    },
    {
      name: "TMT Bars",
      price: "₹30,000",
      stock: 250,
      category: "Reinforcement",
      image: "/images/tmt-bars.jpg",
      description: "Thermo-mechanically treated bars",
    },
  ];

  for (const product of products) {
    await db.collection("products").add(product);
  }

  // PROJECTS
  await db.collection("projects").add({
    name: "Mumbai Commercial Complex",
    status: "In Progress",
  });

  await db.collection("projects").add({
    name: "Aurangabad Steel Plant",
    status: "Completed",
  });

  // USERS
  await db.collection("users").add({ role: "user" });
  await db.collection("users").add({ role: "user" });
  await db.collection("users").add({ role: "admin" });

  // ORDERS
  await db.collection("orders").add({ amount: 25000 });
  await db.collection("orders").add({ amount: 18500 });
  await db.collection("orders").add({ amount: 32000 });

  console.log("✅ Overview seed data inserted successfully");
  process.exit(0);
}

seedOverview().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
