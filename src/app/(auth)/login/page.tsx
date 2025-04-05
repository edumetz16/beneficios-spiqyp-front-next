

import { redirect } from "next/navigation";

import PageContent from "../../components/PageContent";
import { isUserAuthenticated } from "@/services/auth/auth.service";
import SignIn from "../../components/signIn/signIn";



export default async function SignInPage() {
  // if (await isUserAuthenticated()) redirect("/dashboard");
  
  return (
    <>
          <SignIn></SignIn>
    </>
  );
}