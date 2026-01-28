import admin from "firebase-admin";
import fs from "fs";

// Read service account JSON
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Products to insert
const products = [
  {
    name: "Steel Beams & Columns",
    description: "High-strength structural steel beams and columns",
    image: "/photos/steel beems.jpg",
    category: "structural",
    price: "₹450/kg",
  },
  {
    name: "Custom Gate Designs",
    description: "Elegant and secure custom-designed gates",
    image: "/photos/WhatsApp Image 2025-09-02 at 23.30.03_083a883e.jpg",
    category: "custom",
    price: "Quote on Request",
  },
  {
    name: "Industrial Platforms",
    description: "Heavy-duty steel platforms for industrial use",
    image: "/photos/ss-platform-trolly.png",
    category: "industrial",
    price: "₹380/sq ft",
  },
  {
    name: "Staircase Railings",
    description: "Modern steel railings for staircases",
    image: "/photos/stair chase.jpg",
    category: "residential",
    price: "₹2,500/meter",
  },
];

async function seedProducts() {
  const batch = db.batch();

  products.forEach((product) => {
    const ref = db.collection("products").doc(); // Auto-ID
    batch.set(ref, product);
  });

  await batch.commit();
  console.log("✅ Products added successfully!");
}

seedProducts().catch((err) => {
  console.error("❌ Error seeding products:", err);
});
