"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HomeIcon, Bars3Icon, IdentificationIcon, MagnifyingGlassIcon, MapIcon } from "@heroicons/react/24/outline"
import { AffiliationCard } from "../affiliation/AffiliationCard"
import { useAuth } from "@/app/auth/AuthContext"

export const TabbedMenu = () => {
  const { user } = useAuth();
  const [showCard, setShowCard] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  // Only show if user is logged in
  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <AffiliationCard onClose={() => setShowCard(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-0 w-full flex justify-center z-10">
        <div className="relative grid grid-cols-5 items-center justify-between bg-white rounded-full shadow-xl h-16 w-[90vw] max-w-md">
          {/* Home Icon */}
          <button className="flex flex-col col-span-1 items-center justify-center focus:outline-none" onClick={() => router.push("/") }>
            <HomeIcon className={`w-7 h-7 ${pathname === "/" ? "text-primary" : "text-gray-400"}`} />
            <span className="block mt-1">
              {pathname === "/" && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
              {pathname !== "/" && <span className="text-gray-400 text-xs">Inicio</span>}
            </span>
          </button>
          {/* Home Icon */} 
          <button className="flex flex-col items-center justify-center focus:outline-none" onClick={() => router.push("/benefits") }>
            <Bars3Icon className={`w-7 h-7 ${pathname === "/benefits" ? "text-primary" : "text-gray-400"}`} />
            <span className="block mt-1">
              {pathname === "/benefits" && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
              {pathname !== "/benefits" && <span className="text-gray-400 text-xs">Beneficios</span>}
            </span>
          </button>

          {/* Floating Credencial Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7">
            <motion.button
              onClick={() => setShowCard(true)}
              className="w-16 h-16 rounded-full bg-primary flex flex-col items-center justify-center shadow-lg border-4 border-white"
              whileTap={{ scale: 0.95 }}
            >
              <IdentificationIcon className="w-8 h-8 text-white" />
            </motion.button>
            <span className="block text-xs text-primary font-semibold mt-1 text-center">Credencial</span>
          </div>

          {/* Hamburger Icon */}
          <div className="w-16 h-16 flex items-center justify-center">
          </div>
          {/* Hamburger Icon */}
          <button className="flex flex-col items-center justify-center focus:outline-none" onClick={() => router.push("/search")}>
            <MagnifyingGlassIcon className={`w-7 h-7 ${pathname === "/search" ? "text-primary" : "text-gray-400"}`} />
            <span className="block mt-1">
              {pathname === "/search" && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
              {pathname !== "/search" && <span className="text-gray-400 text-xs">Buscar</span>}
            </span>
          </button>
          {/* Hamburger Icon */}
          <button className="flex flex-col items-center justify-center focus:outline-none" onClick={() => router.push("/map")}>
            <MapIcon className={`w-7 h-7 ${pathname === "/map" ? "text-primary" : "text-gray-400"}`} />
            <span className="block mt-1">
              {pathname === "/map" && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
              {pathname !== "/map" && <span className="text-gray-400 text-xs">Mapa</span>}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}