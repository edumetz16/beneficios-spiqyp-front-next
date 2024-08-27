
import { useHits, useInstantSearch } from "react-instantsearch";
import CompanyCard from "../../companyCard/CompanyCard";

const FilterHits = () => {
    const {hits} = useHits({})
    const { results } = useInstantSearch();

    hits.forEach(element => {
        element.id = element.objectID
        
    });
    
    return(
        <>
            {
                hits.map((hit:any,i:number) => (
                    <div key={i} className="col-span-4">
                        <CompanyCard content={hit}/>
                    </div>
                ))
            }
        </>
    )
}

export default FilterHits;