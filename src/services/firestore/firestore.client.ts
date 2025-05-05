import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "../firebase/firebase.client";

const app = getFirebaseApp();

export const db = getFirestore(app);
