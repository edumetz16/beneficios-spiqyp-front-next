import { getCompanies, getCompaniesCollections } from "@/services/companies/companies";
import Banner from "./components/swipers/Banners";
import SwiperBenefits from "./components/swipers/SwiperBenefits";
import { getBanners } from "@/services/banners/banners";
import { getCategories } from "@/services/categories/categories";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import SwiperCategories from "./components/swipers/SwiperCategories";
import { where } from "firebase/firestore";



export default  async function Home() {
  
  const carousels = [{
    title: "Beneficios propios",
    categories: ['wcKiFVdl6Oeqas91Czx3']
  },
  {
    title: "Nuevos Beneficios",
    categories: []
  },
  {
    title: "Turismo",
    categories: ['KOkBlSwanviKsargwAIV']
  },
  {
    title: "Hotelería",
    categories: ['IjmcMFFWiFFHoAVmzdLK']
  },
  {
    title: "Campings",
    categories: ['qbtXuMmtK6mVi0LNk90m']
  }]

  const carouselsResponse = await Promise.all(carousels.map(async (carousel) => {
    const companies = await getCompanies(
      carousel.categories.map(category => ({operator: 'array-contains', value: `categories/${category}`, field: 'categories', isReference: true})),
      [{field:'dateCreated', direction:'desc'}],
      5
    );
    return {
      title: carousel.title,
      contents: companies,
      categories: carousel.categories
    }
  }));
  const banners = await getBanners();
  const collections = await getCompaniesCollections()
  const companiesResponse = await getCompanies([], [{field:'dateCreated', direction:'desc'}],5);
  const companiesResponse2 = await getCompanies(
    [{operator: 'array-contains', value: "categories/KOkBlSwanviKsargwAIV", field: 'categories', isReference: true}],
    [{field:'dateCreated', direction:'desc'}],
    5
  );
  const companiesResponse3 = await getCompanies(
    [{operator: 'array-contains', value: "categories/IjmcMFFWiFFHoAVmzdLK", field: 'categories', isReference: true}],
    [{field:'dateCreated', direction:'desc'}],
    5
  );
  const companiesResponse4 = await getCompanies(
    [{operator: 'array-contains', value: "categories/wcKiFVdl6Oeqas91Czx3", field: 'categories', isReference: true}],
    [{field:'dateCreated', direction:'desc'}],
    5
  );
  const categories= await getCategories([], false);
  return (
    <main>
      <section>
        <Banner content={banners}/>
      </section>
      <section className="mt-6">
        {/* {
          collections.map( (collection:any,i:number) => (
            <div key={i} className="container mt-6">
              <SwiperBenefits 
                title={collection.title} 
                linkCategory="/companies"
                description={collection.description} 
                contents={companiesResponse.companies}/>
            </div>
          ))
        } */}
        <div className="container mt-6">
          <h3 className="text-2xl font-bold text-black mb-4">Categorías</h3>
          <SwiperCategories categories={categories}/>
        </div>
        {
          carouselsResponse.map((carousel, i) => (
            <div key={i} className="container mt-6">
              <SwiperBenefits 
                title={carousel.title} 
                contents={carousel.contents}
                categories={carousel.categories}/>
            </div>
          ))
        }
      </section>
    </main>
  );
}
