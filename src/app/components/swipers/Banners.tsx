'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";

interface BannersProps {
  content: any[];
  isCompany?:boolean;
}

const Banner = ({content, isCompany=false}:BannersProps) => {
      
      return(
        <div className={``}>
          <Swiper
            className={`aspect-square md:aspect-[3/1] swiperBenefits`}   
            navigation={true}
            pagination={true}
            modules={[Navigation,Pagination]}            
          >
            {
            content.map( (b:any , i:number) => (
                <SwiperSlide key={i}>
                    <div className={`w-full h-full ${isCompany ? 'hidden' : 'block'}`}>
                        <Image className="hidden lg:block object-cover w-full" src={b.desktopImage} alt="banner" width={1500} height={500}/>
                        <Image className="lg:hidden w-full object-cover" src={b.mobileImage} alt="banner" width={338} height={438}/>
                    </div>
                    <div className={`w-full h-full ${isCompany ? 'block' : 'hidden'}`}>
                        <Image className="object-cover w-full max-h-[439px]" src={b} alt="img-company" width={585} height={439}/>
                    </div>
                </SwiperSlide> 
            ))
            }
             
          </Swiper>
        </div>
    )
}

export default Banner;