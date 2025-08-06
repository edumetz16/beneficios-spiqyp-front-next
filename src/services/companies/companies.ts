import { startAfter } from "firebase/database";
import { db } from "../firestore/firestore"
import { DocumentData, DocumentReference, FieldPath, OrderByDirection, Query, WhereFilterOp } from "firebase-admin/firestore";
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

export const getCompaniesOld = async (limit: number, order?: {field: string, direction: OrderByDirection, lastItem?: any},companiesIds?:string[]): Promise<CompaniesResponse> => {
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

export const getCompanies = async (
    filters:{operator: WhereFilterOp, field: string, value: any, isReference?: boolean}[] = [], 
    sort: {field: string, direction: OrderByDirection}[] = [],
    limit?: number, 
    lastItemId?: string,
): Promise<Company[]> => {
    const companies: Company[] = [];
    let q: Query<DocumentData, DocumentData> = db.collection('companies');

    filters.forEach(filter => {
        if(filter.isReference) {
            q = q.where(filter.field,filter.operator,db.doc(filter.value))
        } else {
            q = q.where(filter.field,filter.operator,filter.value)
        }
    })

    sort.forEach(order => {
        q = q.orderBy(order.field, order.direction)
    })

    if (lastItemId) {
        console.log('lastItemId', lastItemId);
        const snap = await db.doc(`companies/${lastItemId}`).get();
        q = q.startAfter(snap)
    }

    if (limit) {
        q = q.limit(limit)
    }


    const companiesSnapDocs = (await q.get()).docs;
    for (const doc of companiesSnapDocs) {
        const company = serializeFirestoreDocument(doc.data());
        const categories = await getCategories(company);
        const locations = await getLocations(company);
        companies.push({
            id:doc.id,
            categories,
            locations,
            ...company
        } as Company)
    }

    return companies;
}