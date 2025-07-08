"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HomeIcon, Bars3Icon, IdentificationIcon } from "@heroicons/react/24/outline"
import { AffiliationCard } from "../affiliation/AffiliationCard"
import { useAuth } from "@/app/auth/AuthContext"

export const TabbedMenu = () => {
  const { user } = useAuth();
  const [showCard, setShowCard] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  // Only show if user is logged in
  if (!user) return null;

  const isHome = pathname === "/";

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
        <div className="relative flex items-center justify-between bg-white rounded-full shadow-xl px-8 h-16 w-[90vw] max-w-md">
          {/* Home Icon */}
          <button className="flex flex-col items-center justify-center focus:outline-none" onClick={() => router.push("/") }>
            <HomeIcon className={`w-7 h-7 ${isHome ? "text-primary" : "text-gray-400"}`} />
            <span className="block mt-1">
              {isHome && <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>}
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
          <button className="flex flex-col items-center justify-center focus:outline-none">
            <Bars3Icon className="w-7 h-7 text-gray-400" />
          </button>
        </div>
      </div>
    </>
  )
}