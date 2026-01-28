const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 🔴 REPLACE with REAL Firebase Auth UID
const USER_UID = "PASTE_REAL_USER_UID_HERE";

const orders = [
  {
    userId: USER_UID,
    total: 4500,
    status: "pending",
  },
  {
    userId: USER_UID,
    total: 8200,
    status: "processing",
  },
  {
    userId: USER_UID,
    total: 12000,
    status: "delivered",
  },
];

async function seedOrders() {
  try {
    for (const order of orders) {
      await db.collection("orders").add({
        userId: order.userId,
        total: order.total,
        status: order.status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Order seeded: ₹${order.total} (${order.status})`);
    }
    console.log("🎉 All orders seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    process.exit(1);
  }
}

seedOrders();
