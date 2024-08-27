'use client'
import algoliasearch from "algoliasearch/lite"
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Highlight, Hits, SearchBox, useHits } from "react-instantsearch";
import { useState } from "react";
import CustomHits from "./customHits/customHits";

const Search = () => {
  const APPID: any = process.env.NEXT_PUBLIC_ALGOLIA_APPID;
  const APIKEY: any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;

  const algoliaClient = algoliasearch(APPID, APIKEY);
  const searchClient = {
    ...algoliaClient,
    search(requests: any[]) {
      if (requests.every(({ params }) => !params.query || params.query.length < 3)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            hitsPerPage: 0,
            exhaustiveNbHits: false,
            query: '',
            params: '',
          })),
        });
      }
      return algoliaClient.search(requests);
    }
  }

  const [results, setResults] = useState([]);

  return (
    <>
      <InstantSearchNext
        searchClient={searchClient as any}
        indexName="companies"
        stalledSearchDelay={500}
      >
        <div className="flex flex-col w-full items-center relative z-20">
          <SearchBox classNames={{
          root: 'w-full',
          form: 'relative',
          input: 'block w-full pl-6 py-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-primary focus:primary rounded-md focus:ring-1',
          submit: 'absolute top-0 left-2 bottom-0 w-8',
          reset: 'absolute top-0 right-0 bottom-0 w-8',
        }}/>
          <CustomHits />
        </div>


      </InstantSearchNext>
      {/* <input className="rounded-xl px-2 border text-xl" placeholder="Buscar beneficio"/> */}
    </>
  )
}

export default Search