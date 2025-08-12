"use client";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, RefinementList, Pagination, useRefinementList, HitsPerPage } from "react-instantsearch";
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

  if (!facetsLoaded) {
    return <div className="text-sm text-gray-500">Cargando filtros...</div>;
  }

  return (
    <>
      {availableFacets.length === 0 ? (
        <div className="text-sm text-gray-500">No se encontraron filtros disponibles</div>
      ) : (
        availableFacets.map((attribute) => (
          <CustomRefinementList 
            key={attribute} 
            attribute={attribute} 
            categoryMap={categoryMap}
          />
        ))
      )}
    </>
  );
}

// Unified RefinementList component that works for all attributes
function CustomRefinementList({ 
  attribute, 
  categoryMap 
}: { 
  attribute: string; 
  categoryMap: Record<string, Category>; 
}) {
  const { items, refine, canRefine, isShowingMore, canToggleShowMore, toggleShowMore } = useRefinementList({
    attribute,
    limit: 5,
    showMoreLimit: 20,
  });

  const [showSearch, setShowSearch] = useState(false);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearch) {
        const searchContainer = event.target as Element;
        if (!searchContainer.closest('.search-container')) {
          setShowSearch(false);
        }
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  // Generate configuration based on attribute
  const getConfig = (attr: string) => {
    const configs: Record<string, any> = {
      categories: {
        title: "Categoría",
        searchable: false,
        transformItems: (items: any[]) => items.map((item: any) => ({
          ...item,
          label: categoryMap[item.value] ? categoryMap[item.value].name : item.label
        }))
      },
      "flettenedLocations.city": {
        title: "Localidad",
        searchable: true,
        transformItems: (items: any[]) => items.map((item: any) => ({
          ...item,
          label: item.label.charAt(0).toUpperCase() + item.label.slice(1)
        }))
      },
      "flettenedLocations.province": {
        title: "Provincia",
        searchable: true,
        transformItems: (items: any[]) => items.map((item: any) => ({
          ...item,
          label: item.label.charAt(0).toUpperCase() + item.label.slice(1)
        }))
      }
    };

    return configs[attr] || {
      title: `Filtrar por ${attr.replace(/\./g, ' ')}`,
      searchable: true,
      transformItems: (items: any[]) => items
    };
  };

  const config = getConfig(attribute);
  const transformedItems = config.transformItems(items);

  if (!canRefine) return null;

  return (
    <div className="mb-6">
      <div className="relative mb-4 search-container">
        {/* Animated search input that covers the title */}
        {config.searchable && (
          <div 
            className={`absolute top-0 right-0 transition-all duration-300 ease-in-out z-10 ${
              showSearch 
                ? 'w-full opacity-100' 
                : 'w-0 opacity-0 pointer-events-none'
            }`} 
            style={{ 
              minWidth: showSearch ? '200px' : '0px',
            }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder={`Buscar ${config.title.toLowerCase()}`}
                className={`block w-full pl-3 pr-12 py-1.5 bg-white border border-slate-300 placeholder-slate-400 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 rounded-md transition-all duration-300 ${
                  showSearch ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Close button (X) */}
              <button
                onClick={() => setShowSearch(false)}
                className="absolute top-0 right-2 bottom-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Title and search icon container */}
        <div className={`flex items-center transition-all duration-300 relative z-0 ${
          showSearch ? 'justify-end' : 'justify-between'
        }`}>
          <h2 className={`text-xl font-semibold transition-all duration-300 text-gray-900 ${
            showSearch ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {config.title}
          </h2>
          {config.searchable && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1 text-gray-400 hover:text-primary transition-all duration-300 ${
                showSearch ? 'text-primary' : 'text-gray-400'
              }`}
              title="Buscar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {transformedItems.map((item: any) => (
          <label key={item.value} className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                item.isRefined 
                  ? 'bg-primary border-primary' 
                  : 'bg-white border-slate-300 group-hover:border-primary group-hover:bg-slate-50'
              }`}>
                {item.isRefined && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
            <span className="ml-2 bg-primary text-[8px] text-white px-2 py-1 rounded-xl">
              {item.count}
            </span>
          </label>
        ))}
        
        {/* Show more/less button */}
        {canToggleShowMore && (
          <button
            onClick={toggleShowMore}
            className="mt-4 text-primary hover:text-primary-dark cursor-pointer font-medium"
          >
            {isShowingMore ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        )}
      </div>
    </div>
  );
}

function CustomHits() {
  const { items } = useHits();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item: any) => 
        <CompanyCard key={item.objectID} content={item} />
      )}
    </div>
  );
}

export default function SearchPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Beneficios</h1>
      
      <InstantSearch
        searchClient={searchClient}
        indexName="companies"
        routing={true}
        >
        <div className="flex flex-col md:flex-row gap-8 w-full mx-auto">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-1/4 w-full mb-6 md:mb-0 text-black">
            <DynamicFacets />
          </aside>

          {/* Mobile Filter Sidebar Overlay */}
          <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
            showMobileFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilters(false)}
            />
            
            {/* Sidebar */}
            <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              showMobileFilters ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <DynamicFacets />
              </div>
            </div>
          </div>

          <section className="flex-1">
            {/* Mobile Layout: Filter button + hits per page side by side, search bar full width below */}
            <div className="md:hidden flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtros
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-medium">Mostrar</span>
                  <div className="relative">
                    <HitsPerPage
                      items={[
                        { label: '12', value: 12, default: true },
                        { label: '24', value: 24 },
                        { label: '48', value: 48 }
                      ]}
                      classNames={{
                        root: 'relative',
                        select: 'appearance-none bg-white border border-slate-300 text-gray-900 py-2 px-3 pr-8 rounded-md focus:outline-none focus:border-primary focus:ring-1 cursor-pointer hover:border-slate-400 transition-colors',
                        option: 'py-1 px-2',
                      }}
                    />
                    {/* Custom dropdown caret */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>

            {/* Desktop Layout: Search bar and hits per page side by side */}
            <div className="hidden md:flex gap-4 items-center"> 
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
              <div className="flex gap-4 items-center">
                <span className="text-primary font-medium">Mostrar</span>
                <div className="relative">
                  <HitsPerPage
                    items={[
                      { label: '12', value: 12, default: true },
                      { label: '24', value: 24 },
                      { label: '48', value: 48 }
                    ]}
                    classNames={{
                      root: 'relative',
                      select: 'appearance-none bg-white border border-slate-300 text-gray-900 py-2 px-3 pr-8 rounded-md focus:outline-none focus:border-primary focus:ring-1 cursor-pointer hover:border-slate-400 transition-colors',
                      option: 'py-1 px-2',
                    }}
                  />
                  {/* Custom dropdown caret */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              
              <CustomHits  />
              <Pagination
                classNames={{
                  list: 'flex justify-center mt-6',
                  root: 'flex justify-center mt-6',
                  item: 'mx-1 text-primary',
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