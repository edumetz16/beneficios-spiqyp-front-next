"use client"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { EllipsisVerticalIcon, ShareIcon, ArrowDownTrayIcon, PhoneIcon, KeyIcon } from "@heroicons/react/24/outline"
import { useUserData } from "@/app/context/UserDataContext"

interface AffiliationCardProps {
  onClose: () => void
}

function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

export const AffiliationCard = ({ onClose }: AffiliationCardProps) => {
  const { userData, loading, error } = useUserData();

  if (loading) return <div className="flex justify-center items-center h-full">Cargando...</div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">Error al cargar los datos</div>;
  if (!userData) return null;

  const affiliateNumber = userData.affiliateNumber || "123456/78"
  const fullName = `${capitalize(userData.lastName)} ${capitalize(userData.firstName)}`.trim()
  const govId = userData.govId || "00000000"
  const category = userData.category || "Afiliado"

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50">
      <div className="relative w-[90%] max-w-md bg-primary rounded-3xl shadow-xl px-6 pt-8 pb-6 flex flex-col min-h-[340px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white/70 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        {/* Three-dot menu */}
        <button className="absolute top-4 right-4 text-white/70 hover:text-white">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </button>
        {/* Card content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-white text-lg tracking-widest font-mono mb-2">{affiliateNumber}</p>
            <p className="text-white text-xl font-semibold mb-1 capitalize">{fullName}</p>
            <p className="text-white text-lg tracking-widest font-mono">{govId}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              {category}
            </span>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4 mb-2 gap-2">
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
        </div>
        {/* Card logo/title */}
        <div className="flex justify-center mt-2">
          <span className="text-white font-bold text-lg tracking-widest">SPIQyP</span>
        </div>
      </div>
    </div>
  )
} 