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
  const categories= await getCategories();
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
          <h3 className="text-2xl font-bold text-black">Categorías</h3>
          <SwiperCategories categories={categories}/>
        </div>
        <div className="container mt-6">
          <SwiperBenefits 
            title={"Nuevos Beneficios"} 
            linkCategory="/companies"
            description="" 
            contents={companiesResponse}/>
        </div>
        <div className="container mt-10">
          <SwiperBenefits 
            linkCategory="/companies"
            title={"Turismo"} 
            contents={companiesResponse2}
            categories={['KOkBlSwanviKsargwAIV']}/>
        </div>
        <div className="container mt-10">
          <SwiperBenefits 
            linkCategory="/companies"
            title={"Hotelería"} 
            contents={companiesResponse3}
            categories={['IjmcMFFWiFFHoAVmzdLK']}/>
        </div>
      </section>
    </main>
  );
}
