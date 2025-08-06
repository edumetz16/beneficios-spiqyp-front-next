import { db } from "../firestore/firestore"
import { Category } from "./categories.type";


export const getCategories = async (categoryRefs?:string[]) : Promise<Category[]> => {
    let categories:Category[] = [];
    if(categoryRefs){
        for(const categoryRef of categoryRefs){
            const category = await db.doc(categoryRef).get();
            categories.push({
                id:category.id,
                ...category.data()
            } as Category)
        }
    } else {

        categories = (await db.collection('categories').get()).docs.map(doc => {
            return {
                id:doc.id,
                ...doc.data()
            } as Category
        })
    }

    return categories
}