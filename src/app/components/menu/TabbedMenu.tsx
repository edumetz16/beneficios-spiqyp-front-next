"use client"
import { useAuth } from "@/app/auth/AuthContext"
import { CardIcon } from "../icons"

export const TabbedMenu = () => {
  const {user} = useAuth();
  return (
    <>
      {user && <div className="lg:hidden fixed z-10 bottom-0 w-full">
        <div className="flex gap-4 justify-center bg-white drop-shadow-xl w-full h-10">
          <div className="rounded-full bg-white flex flex-col items-center justify-center -translate-y-4 w-16 h-16">

            <CardIcon className="text-primary fill-primary w-8 h-8"/>
            <span className="text-primary text-xs">Credencial</span>
          </div>
        </div>
      </div>}
    </>
  )
}