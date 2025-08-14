import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.scss";
import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";
import { getCurrentUser, isUserAuthenticated } from "@/services/auth/auth.service";
import { cookies, headers } from "next/headers";
import { AuthProvider } from "./auth/AuthProvider";
import { getTokens } from "next-firebase-auth-edge";
import { authConfig } from "@/config/server.config";
import { toUser } from "@/shared/user";
import { TabbedMenu } from "./components/menu/TabbedMenu";
import {Alert} from "@heroui/alert";
import { Button } from "@heroui/react";
import { sendEmailVerification, User } from "firebase/auth";
import { AppAlert } from "./components/appAlert/AppAlert";
import { UserDataProvider } from "./context/UserDataContext";

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi SPIQyP",
  description: "Aplicación de beneficios para afiliados de SPIQyP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const tokens = await getTokens(cookies(), {
    ...authConfig,
    headers: headers()
  });
  const user = tokens ? toUser(tokens) : null;

  

  return (
    <html lang="en">
      <AuthProvider user={user}>
        <UserDataProvider>
          <body className={`${pjs.className} bg-[#f6f6f3] pb-20 lg:pb-0`}>
            <AppAlert/>
            <Menu/>
            <div>
              {children}
            </div>
            <Footer/>
            <TabbedMenu/>
          </body>
        </UserDataProvider>
      </AuthProvider>
    </html>
  );
}
