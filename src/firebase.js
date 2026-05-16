import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdEkML48wm7CkQ85QDvLxljRAY6CMZn6U",
  authDomain: "civic-report-system-7eb31.firebaseapp.com",
  projectId: "civic-report-system-7eb31",
  storageBucket: "civic-report-system-7eb31.firebasestorage.app",
  messagingSenderId: "392666599823",
  appId: "1:392666599823:web:be1b982c655833e491bbfa",
  measurementId: "G-F56LVLLM03"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
