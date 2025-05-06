"use client"
import { useHits } from "react-instantsearch";
import BenefitsCustomHits from "./BenefitsCustomHits";
import { Pagination } from "react-instantsearch";

const BenefitsHitsWithEmptyState = () => {
  const { hits } = useHits();
  const hasResults = hits && hits.length > 0;

  return (
    <>
      {hasResults ? (
        <>
          <BenefitsCustomHits />
          <Pagination
            classNames={{
              root: 'flex justify-center mt-6',
              item: 'mx-1',
              selectedItem: 'bg-primary text-white rounded-full',
              link: 'px-3 py-1 rounded',
            }}
            showFirst={false}
            showLast={false}
          />
        </>
      ) : (
        <div className="text-center text-gray-500 py-12 text-lg">
          No se encontraron resultados para tu búsqueda.
        </div>
      )}
    </>
  );
};

export default BenefitsHitsWithEmptyState; 