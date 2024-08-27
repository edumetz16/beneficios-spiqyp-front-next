import { Company, getCompanies } from "@/services/companies/companies"
import CompanyCard from "../components/companyCard/CompanyCard";
import { Category, getCategories } from "@/services/categories/categories";
import CustomFilters from "../components/search/customFilters/customFilters";
import CustomHits from "../components/search/customHits/customHits";
import Filters from "../components/search/filters/filters";

 export default async function companiesPage(){
    
    const data = await getCompanies(10);
    const categories = await getCategories();

    return (
        <>
            <Filters/>
            
        </>
    )
 }