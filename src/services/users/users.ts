import { DocumentReference } from "firebase-admin/firestore";
import { db } from "../firestore/firestore"
import { serializeFirestoreDocument } from "../util";
import { UserData } from "./types";

export const getUserById = async (id: string) => {
    const user = await db.doc(`users/${id}`).get();
    if(!user.exists) throw "User does not exist";
    return serializeFirestoreDocument(user.data());
}

export const createUser = async (data: UserData, id?: string) => {
    let newUserRef;
    if(id) newUserRef = db.doc(`users/${id}`);
    else newUserRef = db.collection("users").doc();
    const newUser = {
        ...data,
        id: newUserRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await newUserRef.set(newUser);
    return serializeFirestoreDocument(newUser);
}