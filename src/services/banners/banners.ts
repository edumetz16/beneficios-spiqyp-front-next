import { db } from "../firestore/firestore"
import { serializeFirestoreDocument } from "../util";

export const getBanners = async () => {
    const banners = (await db.collection('banners').where("active","==",true).orderBy("dateUpdated", "desc").get()).docs.map(doc => serializeFirestoreDocument(doc.data()));
   
    if (banners.length === 0) {
        return [];
    }
    return banners;
}