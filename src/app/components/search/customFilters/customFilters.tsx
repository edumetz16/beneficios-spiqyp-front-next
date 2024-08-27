'use client'
import algoliasearch from "algoliasearch";
import { Configure, InstantSearch, RefinementList } from "react-instantsearch";
import CustomHits from "../customHits/customHits";

const CustomFilters = () => {
    const APPID:any =  process.env.NEXT_PUBLIC_ALGOLIA_APPID;
    const APIKEY:any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;

    const searchClient = algoliasearch(APPID,APIKEY)
    return(
        <>
           
                    
                    <div className="container">
                        <Configure ruleContexts={[]}/>
                        <div>
                            <p>Categorias</p>
                                <div className="w-full">
                                    <RefinementList
                                        classNames={{
                                            searchBox:"mb-6",
                                            checkbox:"mr-2",
                                            labelText:"text-sm",
                                            count: "ml-2 bg-orange-400 text-[8px] text-white p-1 rounded-full",
                                            showMore:"mt-4"
                                        }}
                                        attribute="categories"
                                        searchable={true}
                                        searchablePlaceholder="Buscar categorias"
                                        showMore={true}
                                        sortBy={['name:desc']}>
                                    </RefinementList>
                                </div>
                                {/* <div>
                                    <Menu attribute="categories" showMore={true}/>
                                </div> */}
                        </div>
                    </div>
        </>
    )
}

export default CustomFilters;