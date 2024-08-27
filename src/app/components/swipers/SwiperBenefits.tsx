'use client'
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/swiper-bundle.css";
import CompanyCard from "../companyCard/CompanyCard";
import { useRef, useState } from "react";

interface SwiperBenefitsProps {
    title:string;
    description?:string;
    contents: any[];
    linkCategory:string;
}
const SwiperBenefits = ({title,contents,description,linkCategory}:SwiperBenefitsProps) => {
    
    const [swiperContents, setSwiperContents] = useState(contents);



    async function getMoreCompanies(){
            const lastItem = swiperContents[swiperContents.length - 1];
            if(lastItem === undefined || !lastItem.id) return;
           const resp = await fetch("/api/companies",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit:1,
                lastItem,
            })
           })

           const responseJson = await resp.json();
           if(responseJson.success) setSwiperContents([...swiperContents, ...responseJson.data.companies]);

    }

    return (
        <>
            <div className="text-black grid grid-cols-12 items-center">
                <div className="col-span-12 flex items-center">
                    <h2 className="text-2xl lg:text-4xl font-bold ">{title}</h2>
                    <Link className="text-sm lg:text-lg text-primary font-bold ml-auto" href={linkCategory}>
                        <div className="flex items-center gap-2">
                            <p className="text-sm lg:text-base">Mas beneficios</p>
                            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5774 8.57741C13.252 8.90285 13.252 9.43049 13.5774 9.75592C13.9028 10.0814 14.4305 10.0814 14.7559 9.75592L18.9226 5.58926C19.248 5.26382 19.248 4.73618 18.9226 4.41075L14.7559 0.244078C14.4305 -0.0813593 13.9028 -0.0813593 13.5774 0.244078C13.252 0.569515 13.252 1.09715 13.5774 1.42259L16.3215 4.16667H1.66666C1.20642 4.16667 0.833328 4.53976 0.833328 5C0.833328 5.46024 1.20642 5.83333 1.66666 5.83333H16.3215L13.5774 8.57741Z" fill="#155e75"/>
                            </svg>
                        </div>
                    </Link>
                </div>
                <div className="col-span-12">
                    <p className="mt-4">{description}</p>
                </div>
            </div>
            <div className="flex justify-center mt-6 relative">
            <Swiper
                className={`swiperBenefits px-4 -mx-4`}   
                slidesPerView={1}
                spaceBetween={8}
                pagination={{
                    el:'.swiper-paginations',
                    clickable:true,
                    type:'bullets'
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 8
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 8
                    },
                    1280: {
                        slidesPerView: 4,
                        spaceBetween: 8
                    },
                    }}
                navigation={true}

                onReachEnd={(swiper) => {getMoreCompanies()}}
                modules={[Navigation,Pagination]}            
            >
                {
                    swiperContents.map( (content , i) => (
                        <SwiperSlide key={i}>
                            <CompanyCard content={content}/>
                        </SwiperSlide> 
                    ))
                }
            
            </Swiper>
            <div className="swiper-pagination swiper-paginations absolute"></div>
            </div>
        </>
    )
}

export default SwiperBenefits;