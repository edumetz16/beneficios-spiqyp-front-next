"use client"

import "swiper/css";
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

export default function SwiperCategories({categories}: {categories: any[]}) {

    return (
        <Swiper 
            slidesPerView={6}
            spaceBetween={10}
            // pagination={{
            //   clickable: true,
            // }}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              0: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 6,
              },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div >
                  <Link className="flex flex-col items-center gap-2" href={`/benefits?${encodeURIComponent(`companies[refinementList][categories][0]`)}=${encodeURIComponent(`categories/${category.id}`)}`}>
                    <div className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-full aspect-square">
                      <Image src={category.icon || ""} alt={category.name} width={100} height={100}/>
                    </div>
                    <h1 className="text-sm font-bold text-black">{category.name}</h1>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
    )
}