import { startAfter } from "firebase/database";
import { db } from "../firestore/firestore"
import { FieldPath, OrderByDirection } from "firebase-admin/firestore";
import { doc, or, orderBy } from "firebase/firestore";
import { isDate } from "util/types";
import { serializeFirestoreDocument } from "../util";

type CompaniesResponse = {
    companies: Company[],
    startAfter?: string
}
export type Company = {
    id: string;
    address:string;
    categories:string[];
    companyImage:string;
    description:string;
    email:string;
    locations:any[];
    name:string;
    phone:number;
    socialMedia:any;
    website:string;
    dateCreated:any;
    objectId?:string;
    companyLogo?:string;
}

export const getCompanies = async (limit: number, order?: {field: string, direction: OrderByDirection, lastItem?: any},companiesIds?:string[]): Promise<CompaniesResponse> => {
    const result: CompaniesResponse = {
      companies: [],
    };
    let query;
    const companiesRef = db.collection('companies');

    query = companiesRef;

    if (companiesIds) {
        query = query.where("id",'in',companiesIds)
    }
    
    if(order) {
        query = query.orderBy(order.field, order.direction);
        if(order.lastItem) {
            let startAfterCursor = order.lastItem[order.field];
            const startAfterDate = new Date(startAfterCursor);
            if(typeof startAfterCursor === 'string' && !isNaN(startAfterDate.getDate())) startAfterCursor = startAfterDate;
            query = query.startAfter(startAfterCursor);
        }
    }

    const companies =  (await query.limit(limit).get()).docs;    
    result.companies = companies.map(doc => {      
        
      return {
          id:doc.id,
          ...serializeFirestoreDocument(doc.data())
      } as Company
    });
    
    for (const company of result.companies) {
        const cat:any = await getCategories(company);
        const locations:any = await getLocations(company);
        company.categories = (cat);
        company.locations = (locations);
    }

    return result;
}

export const getCompany = async (id:string): Promise<Company> => {
    const companyRef = db.doc(`companies/${id}`);
    const companyRes = await companyRef.get();
    return serializeFirestoreDocument(companyRes.data()) as Company;
}

export const getBenefitsByCompany = async (companyId:string) => {
    const companyRef = db.doc(`companies/${companyId}`);

    const benefitsRef = db.collection('benefits');
    const benefitsRes = await benefitsRef.where('company','==', companyRef)
    .where('active','==',true).get();

    if (benefitsRes.empty) {
        return []
    }

    return benefitsRes.docs.map(doc => {
        return {
            id:doc.id,
            ...serializeFirestoreDocument(doc.data())
        }
    });
    
}

export const getImageByCompany = async (companyId:string) => {
    const companyRef = db.doc(`companies/${companyId}`);

    const mediaRef = db.collection('media');
    const mediaResp = await mediaRef.where('company','==',companyRef).get();
    if (mediaResp.empty) {
        return [];
    }

    return mediaResp.docs.map(doc => doc.data().image);
}

export const getCompaniesCollections = async () => {
    const collectionsRef = db.collection('companies_collections');
    const collections = await collectionsRef.where('active','==',true).get();
    if (collections.empty){
        return [];
    }

    const companiesCollections = collections.docs.map(doc =>  {
        const companiesIds:string[] = [];

        doc.data().contents.map((content:any) => {
            companiesIds.push(content.id);
        })

        return {
            id:doc.id,
            companiesIds: companiesIds,
            ...doc.data()
        }as any
    })    

    return companiesCollections;
}

const getCategories = async (company:Company) => {
    let categoriesName:string[] = [];
    if (company.categories.length === 0) return [] 
    
    for (const category of company.categories) {
        const cat:any = (await db.doc(`${category}`).get()).data() 
        categoriesName.push(cat.name)
    }
    
    return categoriesName
}

const getLocations = async (company:Company) => {
    let locations:any[] = [];
    if (company.locations.length === 0) return [];

    for (const locale of company.locations) {
        const loc = (await db.doc(`locations/${locale.id}`).get()).data();
        locations.push(loc)
    }

    return locations

}