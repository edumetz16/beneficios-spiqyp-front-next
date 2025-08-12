import { db } from "../firestore/firestore"
import { Category } from "./categories.type";


export const getCategories = async (categoryRefs?:string[], returnEmpty:boolean = true) : Promise<Category[]> => {
    let categories:Category[] = [];
    if(categoryRefs && categoryRefs.length > 0){
        for(const categoryRef of categoryRefs){
            const category = await db.doc(categoryRef).get();
            const companies = await db.collection('companies').where('categories', 'array-contains', category.ref).get();
            if (!companies.empty || returnEmpty){
                categories.push({
                    id:category.id,
                    ...category.data()
                } as Category)
            }
        }
    } else {

        const categoriesResponse = (await db.collection('categories').get())
        for(const category of categoriesResponse.docs){
            const companies = await db.collection('companies').where('categories', 'array-contains', category.ref).get();
            if (!companies.empty || returnEmpty){
                categories.push({
                    id:category.id,
                    ...category.data()
                } as Category)
            }
        }
    }

    return categories
}