import { DocumentReference } from "firebase-admin/firestore";
import { db } from "../firestore/firestore"
import { serializeFirestoreDocument } from "../util";
import { User, UserCreateRequest } from "./types";
import sheetsDatabase from "../firestore/sheetsDatabase";
import { CreateUserRequest } from "@/app/api/auth/[action]/route";

export const getUserById = async (id: string) => {
    const user = await db.doc(`users/${id}`).get();
    if(!user.exists) throw "User does not exist";
    return serializeFirestoreDocument(user.data());
}

export const createUser = async (data: UserCreateRequest, id?: string) => {
    const dbService = new sheetsDatabase();
    const customerDBUser = await dbService.getUserByField(data.govId, 3);
    const mappedData = await mapCustomerUserData(customerDBUser);
    data = {...mappedData, ...data}

    const {...user} = new User(data, id);
    await db.doc(`users/${user.id}`).set(user);
    return user;
}

const mapCustomerUserData = async (data: any) => {
    const mappedData: any = {};
    const customerDBFields= (await db.doc(`config/customer_database_fields`).get()).data() as  Record<string, string> ;
    for(const field in customerDBFields) {
        if(data[customerDBFields[field]]) {
            mappedData[field] = data[customerDBFields[field]];
        } else {
            mappedData[field] = null;
        }
    }
    return mappedData;
}

export const validateCreateUserRequest = async (data: UserCreateRequest) => {
    const user = await db.collection(`users`).where("govId","==", data.govId).get();
    if(!user.empty) throw "User already exists";
}