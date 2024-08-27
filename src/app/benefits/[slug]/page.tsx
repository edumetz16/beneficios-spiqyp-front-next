import BenefitCard from "@/app/components/benefitCard/BenefitCard";
import Banner from "@/app/components/swipers/Banners";
import { getCurrentUser, isUserAuthenticated } from "@/services/auth/auth.service";
import { getBanners } from "@/services/banners/banners";
import { getBenefitsByCompany, getCompany, getImageByCompany } from "@/services/companies/companies";
import { Button, Image } from "@nextui-org/react";
import Link from "next/link";


export default async function BenefitPage({params:{slug}}:any) {
    const banners = await getBanners(); //hay que buscar las imagenes en media
    const company = await getCompany(slug);
    const benefits = await getBenefitsByCompany(slug);
    console.log(benefits);



    const user = await getCurrentUser();
    
    return(
        <>
        <div className="container">
            <div className="flex gap-2 text-black pt-8">
                <p>{`Beneficios > ${company.name}`}</p>
            </div>
            <div className="flex flex-col lg:flex-row text-black mt-6">
                {company.companyLogo ? <Image className="h-16" alt={company.name} src={company.companyLogo} height={100} /> : 
                <h1 className="text-4xl">{company.name}</h1>}
                <button className="w-fit lg:ml-auto mt-2 lg:mt-0 text-primary">Compartir</button>
            </div>
            <div className="mt-6 grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6 flex flex-col">
                    <div className="w-full aspect-[2/1]">

                    <Image src={company.companyImage} alt={company.name}></Image>
                    </div>
                    <div className="p-4 rounded-xl w-full lg:w-2/3 text-black">
                        <p>{company.description}</p>
                        <p className="mt-4">{company.phone}</p>
                        <p>{company.email}</p>
                        <Link href={company.website}>{company.website}</Link>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6 text-black flex flex-col">
                    <div>
                    {
                        benefits.map((benefit:any, i:number) => (
                            <BenefitCard key={i}
                            benefit={benefit}
                            />
                        ))
                    }
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 mt-10">
                
            </div>
        </div>
        </>
    )
}