"use client"
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Pagination } from "react-instantsearch";
import BenefitsHitsWithEmptyState from "./BenefitsHitsWithEmptyState";

const APPID: any = process.env.NEXT_PUBLIC_ALGOLIA_APPID;
const APIKEY: any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;
const searchClient = algoliasearch(APPID, APIKEY);

export default function BenefitsPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Empresas y Beneficios</h1>
      <InstantSearch searchClient={searchClient} indexName="companies">
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
          <SearchBox
            classNames={{
              root: 'w-full',
              form: 'relative',
              input: 'block w-full pl-6 py-2 bg-white border border-slate-300 placeholder-slate-400 text-gray-900 focus:outline-none focus:border-primary focus:primary rounded-md focus:ring-1',
              submit: 'absolute top-0 left-2 bottom-0 w-8',
              reset: 'absolute top-0 right-0 bottom-0 w-8',
              loadingIndicator: 'absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4'
            }}
            placeholder="Buscar empresa o beneficio..."
          />
          <BenefitsHitsWithEmptyState />
        </div>
      </InstantSearch>
    </main>
  );
} 