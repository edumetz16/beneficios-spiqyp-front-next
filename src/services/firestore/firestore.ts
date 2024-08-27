import { getFirestore } from "firebase-admin/firestore";
import { firebaseApp } from "../firebase/firebase";

export const db = getFirestore(firebaseApp)
