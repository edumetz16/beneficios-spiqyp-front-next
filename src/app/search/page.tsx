"use client";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, RefinementList, Pagination, useRefinementList } from "react-instantsearch";
import { useHits } from "react-instantsearch";
import { useEffect, useState } from "react";
import { getCategoriesClient } from "@/services/categories/categories.client";
import { Category } from "@/services/categories/categories.type";
import CompanyCard from "@/app/components/companyCard/CompanyCard";

const APPID: any = process.env.NEXT_PUBLIC_ALGOLIA_APPID;
const APIKEY: any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;
const searchClient = algoliasearch(APPID, APIKEY);

// Dynamic Facet Component
function DynamicFacets() {
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});
  const [facetsLoaded, setFacetsLoaded] = useState(false);
  const [availableFacets, setAvailableFacets] = useState<string[]>([]);

  // Get available facets from Algolia index
  useEffect(() => {
    const discoverFacets = async () => {
      try {
        // Search with empty query to get all facets
        const response = await searchClient.search([
          {
            indexName: "companies",
            params: {
              query: "",
              hitsPerPage: 0, // Don't need hits, just facets
              facets: ["*"], // Get all facets
            },
          },
        ]);

        // Get facets from the response with proper typing
        const searchResult = response.results[0] as any;
        const facets = searchResult?.facets || {};
        const facetAttributes = Object.keys(facets);
                
        // Filter out facets we don't want to show
        const excludedFacets = ['objectID', '_highlightResult', '_snippetResult'];
        const filteredFacets = facetAttributes.filter(facet => !excludedFacets.includes(facet));
                
        if (filteredFacets.length > 0) {
          setAvailableFacets(filteredFacets);
        } else {
          // If no facets discovered, use fallback
          setAvailableFacets(['categories', 'flettenedLocations.city']);
        }
        setFacetsLoaded(true);
      } catch (error) {
        // Fallback to known facets if discovery fails
        setAvailableFacets(['categories', 'flettenedLocations.city']);
        setFacetsLoaded(true);
      }
    };

    discoverFacets();
  }, []);

  // Fetch categories for transformation
  useEffect(() => {
    getCategoriesClient().then((categories) => {
      const map: Record<string, Category> = {};
      categories.forEach((cat) => {
        map[cat.ref] = cat;
      });
      setCategoryMap(map);
    });
  }, []);

  // Generate facet configurations dynamically
  const generateFacetConfig = (attribute: string) => {
    const configs: Record<string, any> = {
      categories: {
        title: "Filtrar por categoría",
        searchable: false,
        searchablePlaceholder: "Buscar categorías",
        showMore: true,
        transformItems: (items: any[]) =>
          items.map((item) => {
            const cat = categoryMap[item.value];
            return {
              ...item,
              label: cat ? cat.name : 'Cargando...',
            };
          }),
      },
      "flettenedLocations.city": {
        title: "Filtrar por localidad",
        searchable: true,
        searchablePlaceholder: "Buscar localidades",
        showMore: true,
      },
      "flettenedLocations.province": {
        title: "Filtrar por provincia",
        searchable: true,
        searchablePlaceholder: "Buscar provincias",
        showMore: true,
      },
      // Add more specific configurations as needed
    };

    return configs[attribute] || {
      title: `Filtrar por ${attribute.replace(/\./g, ' ')}`,
      searchable: true,
      searchablePlaceholder: `Buscar ${attribute.replace(/\./g, ' ')}`,
      showMore: true,
    };
  };

  if (!facetsLoaded) {
    return <div className="text-sm text-gray-500">Cargando filtros...</div>;
  }


  return (
    <>
      {availableFacets.length === 0 ? (
        <div className="text-sm text-gray-500">No se encontraron filtros disponibles</div>
      ) : (
        availableFacets.map((attribute) => {
          const config = generateFacetConfig(attribute);
          return (
            <div key={attribute} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">{config.title}</h2>
              <RefinementList
                attribute={attribute}
                searchable={config.searchable}
                searchablePlaceholder={config.searchablePlaceholder}
                showMore={config.showMore}
                limit={5}
                showMoreLimit={20}
                translations={{
                  showMoreButtonText: ({ isShowingMore }) => 
                    isShowingMore ? 'Mostrar menos' : 'Mostrar más',
                }}
                classNames={{
                  list: "flex flex-col gap-2",
                  label: "flex items-center",
                  searchBox: "mb-4",
                  checkbox: "mr-2 peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-600 checked:border-blue-600",
                  labelText: "text-sm",
                  count: "ml-2 bg-primary text-[8px] text-white px-2 py-1 rounded-xl",
                  showMore: "mt-4 text-primary hover:text-primary-dark cursor-pointer font-medium",
                }}
                transformItems={config.transformItems}
              />
            </div>
          );
        })
      )}
    </>
  );
}

function CustomHits() {
  const { hits } = useHits();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {hits.map((hit: any) => (
        <CompanyCard key={hit.objectID} content={hit} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Beneficios</h1>
      <InstantSearch
        searchClient={searchClient}
        indexName="companies"
        routing={true}
      >
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
          <aside className="md:w-1/4 w-full mb-6 md:mb-0 text-black">
            <DynamicFacets />
          </aside>
          <section className="flex-1">
            <SearchBox
              classNames={{
                root: 'w-full',
                form: 'relative',
                input: 'block w-full pl-6 py-2 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:border-primary focus:primary rounded-md focus:ring-1',
                submit: 'absolute top-0 left-2 bottom-0 w-8',
                reset: 'absolute top-0 right-0 bottom-0 w-8',
                loadingIndicator: 'absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4'
              }}
              placeholder="Buscar beneficio..."
            />
            <div className="mt-6">
              <CustomHits />
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
            </div>
          </section>
        </div>
      </InstantSearch>
    </main>
  );
} 