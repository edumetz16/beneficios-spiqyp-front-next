import { getCompanies, getCompaniesCollections } from "@/services/companies/companies";
import Banner from "./components/swipers/Banners";
import SwiperBenefits from "./components/swipers/SwiperBenefits";
import { getBanners } from "@/services/banners/banners";



export default  async function Home() {
  
  const banners = await getBanners();
  const collections = await getCompaniesCollections()
  const companiesResponse = await getCompanies(5, {field:'dateCreated', direction:'desc'});
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
          <SwiperBenefits 
            title={"Códigos de descuento"} 
            linkCategory="/companies"
            description="¿Estás afiliado a SPIQyP? Descargá tu código y disfrutá beneficios exclusivos en tus marcas favoritas" 
            contents={companiesResponse.companies}/>
        </div>
        <div className="container mt-10">
          <SwiperBenefits 
            linkCategory="/companies"
            title={"Nuevos Beneficios"} 
            contents={companiesResponse.companies}/>
        </div>
      </section>
    </main>
  );
}
