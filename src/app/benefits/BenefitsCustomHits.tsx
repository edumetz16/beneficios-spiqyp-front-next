"use client"
import { useHits } from "react-instantsearch";
import BenefitsCompanyCard from "./BenefitsCompanyCard";

const BenefitsCustomHits = () => {
  const { hits } = useHits();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {hits.map((hit: any) => (
        <BenefitsCompanyCard key={hit.objectID} company={hit} />
      ))}
    </div>
  );
};

export default BenefitsCustomHits; 