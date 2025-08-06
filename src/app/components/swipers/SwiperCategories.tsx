"use client"

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function SwiperCategories({categories}: {categories: any[]}) {
    return (
        <Swiper 
            slidesPerView={6}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="flex flex-col items-center">

                  <div className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-full aspect-square">
                    <Image src={category.icon || ""} alt={category.name} width={100} height={100}/>
                  </div>
                  <h1 className="text-sm font-bold text-black">{category.name}</h1>
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
    )
}