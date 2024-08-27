'use client'
import algoliasearch from "algoliasearch";
import { Configure, InstantSearch, RefinementList } from "react-instantsearch";
import CustomFilters from "../customFilters/customFilters";
import FilterHits from "./filterHits";

const Filters = () => {
    const APPID:any =  process.env.NEXT_PUBLIC_ALGOLIA_APPID;
    const APIKEY:any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;

    const searchClient = algoliasearch(APPID,APIKEY)
    return (
        <>
            {/* <InstantSearch
            searchClient={searchClient}
            indexName="companies"
            routing={true}
            insights={true}
            >
            <div className="container text-black">
                <div className="mt-6">
                    <p className="font-light">{'Home > Beneficios'}</p>
                    <h1 className=" text-4xl font-bold mt-2">Beneficios</h1>
                </div>
                <div className="grid grid-cols-12 gap-4 mt-10">
                    <div className=" flex flex-col gap-4 col-span-3">
                        <CustomFilters/>
                    </div>
                    <div className="col-span-9">
                        <div className="grid grid-cols-12 gap-4">
                        <FilterHits/>
                        </div>
                    </div>
                </div>
                
            </div>   
                        
            </InstantSearch> */}
        </>
    )
}

export default Filters;