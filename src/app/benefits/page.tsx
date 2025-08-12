"use client"
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Pagination } from "react-instantsearch";
import BenefitsHitsWithEmptyState from "./BenefitsHitsWithEmptyState";
import SearchPage from "../search/page";

const APPID: any = process.env.NEXT_PUBLIC_ALGOLIA_APPID;
const APIKEY: any = process.env.NEXT_PUBLIC_ALGOLIA_APIKEY;
const searchClient = algoliasearch(APPID, APIKEY);

export default function BenefitsPage() {
  return (
    <main className="container py-8">
      <SearchPage />
    </main>
  );
} 