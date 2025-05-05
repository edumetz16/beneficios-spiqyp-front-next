import { doc, getDoc } from "firebase/firestore"
import { db } from "../firestore/firestore.client"

export const getUserData = async (userId: string) => {
    const user = (await getDoc(doc(db, 'users', userId))).data()
    return user
}