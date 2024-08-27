import { db } from "../firestore/firestore"

export type Category = {
    id:string;
    name:string;
    icon:string;
}

export const getCategories = async () : Promise<Category[]> => {
    const categories = (await db.collection('categories').get()).docs.map(doc => {
        return {
            id:doc.id,
            ...doc.data()
        } as Category
    })

    return categories
}