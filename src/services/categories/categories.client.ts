

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {db as clientDb} from "../firestore/firestore.client"
import { Category } from "./categories.type";

export const getCategoriesClient = async (categoryRefs?:string[]) : Promise<Category[]> => {
  let categories:Category[] = [];
  if(categoryRefs){
      for(const categoryRef of categoryRefs){
          const category = await getDoc(doc(clientDb, categoryRef));
          categories.push({
              id:category.id,
              ...category.data()
          } as Category)
      }
  } else {

      categories = (await getDocs(collection(clientDb, 'categories'))).docs.map(doc => {
          return {
              ref:doc.ref.path,
              id:doc.id,
              ...doc.data()
          } as Category
      })
  }

  return categories
}