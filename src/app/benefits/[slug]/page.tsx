import BenefitCard from "@/app/components/benefitCard/BenefitCard";
import Banner from "@/app/components/swipers/Banners";
import { getCurrentUser, isUserAuthenticated } from "@/services/auth/auth.service";
import { getBanners } from "@/services/banners/banners";
import { getBenefitsByCompany, getCompany, getImageByCompany } from "@/services/companies/companies";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { Button, Image } from "@heroui/react";
import Link from "next/link";

export default async function BenefitPage({params:{slug}}:any) {
    const banners = await getBanners();
    const company = await getCompany(slug);
    const benefits = await getBenefitsByCompany(slug);
    const user = await getCurrentUser();
    
    return(
        <>
        <div className="container">
            <div className="flex gap-2 text-black pt-8">
                <p>{`Beneficios > ${company.name}`}</p>
            </div>
            <div className="mt-6 grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4 order-1 md:order-2 justify-end">
                    {company.companyLogo ? <Image className="h-16" alt={company.name} src={company.companyLogo} height={100} /> : 
                    <h1 className="text-4xl text-black md:text-right">{company.name}</h1>}
                </div>
                <div className="col-span-12 md:col-span-8 order-2 md:order-1">
                    <div className="rounded-xl w-full text-black">
                        <p>{company.description}</p>
                        <div className="flex gap-4 items-center mt-4">
                            <p className="font-bold">Información de contacto</p>
                            {company.phone && (
                                <Link href={`tel:${company.phone}`} target="_blank" className="text-gray-600 hover:text-primary transition-colors">
                                    <PhoneIcon className="w-6 h-6" />
                                </Link>
                            )}
                            {company.website && (
                                <Link href={company.website} target="_blank" className="text-gray-600 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                </Link>
                            )}
                            {company.socialMedia?.facebook && (
                                <Link href={company.socialMedia.facebook} target="_blank" className="text-gray-600 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                                    </svg>
                                </Link>
                            )}
                            {company.socialMedia?.instagram && (
                                <Link href={company.socialMedia.instagram} target="_blank" className="text-gray-600 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                    </svg>
                                </Link>
                            )}
                            {company.socialMedia?.x && (
                                <Link href={company.socialMedia.x} target="_blank" className="text-gray-600 hover:text-primary transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row text-black mt-6 items-center gap-8">
            </div>
            <div className="mt-6 grid grid-cols-12 gap-4">
                
                <div className="col-span-12 lg:col-span-6">
                    <div className="w-full aspect-[2/1]">
                        <Image src={company.companyImage} alt={company.name}></Image>
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