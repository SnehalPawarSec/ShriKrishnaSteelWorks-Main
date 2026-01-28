import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* ================= PRODUCTS ================= */

export const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (data: any, file: File) => {
  const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(imageRef, file);
  const imageURL = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    ...data,
    image: imageURL,
    createdAt: serverTimestamp(),
  });
};

/* ================= PROJECTS ================= */

export const fetchProjects = async () => {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProject = async (data: any) => {
  await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};
