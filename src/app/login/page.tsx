

import { redirect } from "next/navigation";

import PageContent from "../components/PageContent";
import { isUserAuthenticated } from "@/services/auth/auth.service";
import SignIn from "../components/SignIn/SignIn";



export default async function SignInPage() {
  // if (await isUserAuthenticated()) redirect("/dashboard");
  
  return (
    
    <main className="container">
      
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2">
          <SignIn></SignIn>
        </div>
      </div>
      
      
      {/* <PageContent variant="sign-in" /> */}
    </main>
  );
}