import { DocumentData } from "firebase-admin/firestore";
import { DocumentReference, Timestamp, doc } from "firebase/firestore"

// const dateFields = ['dateCreated', 'dateUpdated', 'dateDeleted', 'endDate', 'startDate'];
export const serializeFirestoreDocument = (docs: DocumentData | DocumentData[] | undefined): any =>{
  if(!docs) return docs;
  if(!Array.isArray(docs)) docs = [docs];
  const docsToReturn = docs.map((doc: any) => {
    doc = serializeProperties(doc);
    
    return doc;
  })
  return docsToReturn.length === 1 ? docsToReturn[0] : docsToReturn;
}

const serializeProperties = (obj: any): any =>{

  if(Array.isArray(obj)) return obj.map(element => processElement(element));
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    newObj[key] = processElement(obj[key]);
  })
  return newObj;
}

const processElement = (element: any) => {
  if(!element) return element;
  else if(element.toDate) element = element.toDate();
  else if(element.path) element = element.path;
  else if(Array.isArray(element)) element = serializeProperties(element);
  else if(typeof element === 'object') element = serializeProperties(element);
  return element;
}