import { db } from "@/services/firestore/firestore"

export const generateId = (): string => {
  return db.collection("generateId").doc().id;
}