"use client"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { EllipsisVerticalIcon, ShareIcon, ArrowDownTrayIcon, PhoneIcon, KeyIcon } from "@heroicons/react/24/outline"
import { useUserData } from "@/app/context/UserDataContext"
import { useEffect, useRef, useState } from "react"
import { db } from "@/services/firestore/firestore.client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { collection, getDocs, query, where } from "firebase/firestore"

interface AffiliationCardProps {
  onClose: () => void
}

function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

export const AffiliationCard = ({ onClose }: AffiliationCardProps) => {
  const { userData, loading, error } = useUserData();
  const [family, setFamily] = useState<any[]>([]);
  const [familyLoading, setFamilyLoading] = useState(false);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      if (!userData?.affiliateNumber) return;
      setFamilyLoading(true);
      let members = [];
      if (userData.roles && userData.roles.includes("holder")) {
        const snap = await getDocs(query(collection(db, "users"), where("affiliateNumber", "==", userData.affiliateNumber)));
        members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        // Remove the logged-in user from the list (if present, compare govId as string)
        members = members.filter(m => String(m.govId).trim() !== String(userData.govId).trim());
        // Put the logged-in user first
        members = [userData, ...members];
      } else {
        members = [userData];
      }
      setFamily(members);
      setFamilyLoading(false);
    };
    fetchFamily();
  }, [userData?.affiliateNumber, userData?.roles, userData?.govId]);

  if (loading || familyLoading) return <div className="flex justify-center items-center h-full">Cargando...</div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">Error al cargar los datos</div>;
  if (!userData) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50">
      <div className="relative w-[90%] max-w-md lg:max-w-xl">
        <div className="mb-8">
          <Swiper
            className="affiliation-swiper"
            slidesPerView={1}
            spaceBetween={16}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary !opacity-50',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !opacity-100',
              el: paginationRef.current,
              type: 'bullets',
              renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
              },
            }}
            modules={[Pagination]}
          >
            {family.map((member) => {
              const affiliateNumber = member.affiliateNumber || "123456/78"
              const fullName = `${capitalize(member.lastName)} ${capitalize(member.firstName)}`.trim()
              const govId = member.govId || "00000000"
              const category = member.category || "Afiliado"
              return (
                <SwiperSlide key={member.id}>
                  <div className="bg-primary rounded-3xl shadow-xl px-6 pt-8 pb-6 flex flex-col min-h-[340px] relative">
                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                    {/* Three-dot menu */}
                    {/* <button className="absolute top-4 right-4 text-white/70 hover:text-white">
                      <EllipsisVerticalIcon className="w-6 h-6" />
                    </button> */}
                    {/* Card content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="mb-6">
                        <p className="text-white text-xl tracking-widest font-mono mb-2">{affiliateNumber}</p>
                        <p className="text-white text-2xl font-semibold mb-1 capitalize">{fullName}</p>
                        <p className="text-white text-xl tracking-widest font-mono">{govId}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                          {category}
                        </span>
                      </div>
                    </div>
                    {/* Action buttons */}
                    {/* <div className="flex items-center justify-between mt-4 mb-2 gap-2">
                      <button className="flex items-center gap-2 border border-white/70 text-white rounded-full px-4 py-1 text-sm hover:bg-white/10 transition">
                        <KeyIcon className="w-5 h-5" />
                        Generar token
                      </button>
                      <button className="p-2 rounded-full border border-white/70 text-white hover:bg-white/10 transition">
                        <ShareIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full border border-white/70 text-white hover:bg-white/10 transition">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full border border-white/70 text-white hover:bg-white/10 transition">
                        <PhoneIcon className="w-5 h-5" />
                      </button>
                    </div> */}
                    {/* Card logo/title */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white text-sm lg:text-lg tracking-widest">Sindicato del Personal de la Industria Química y Petroquímica</span>
                      <img 
                        src="/img/logos/logo_spiqyp.png" 
                        alt="SPIQyP Logo" 
                        className="h-20 lg:h-28 w-auto"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div ref={paginationRef} className="swiper-pagination"></div>
      </div>
    </div>
  )
} 