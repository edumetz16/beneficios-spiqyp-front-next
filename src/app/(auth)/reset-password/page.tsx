

import { redirect } from "next/navigation";

import PageContent from "../../components/PageContent";
import { isUserAuthenticated } from "@/services/auth/auth.service";
import SignIn from "../../components/signIn/signIn";
import ResetPassword from "@/app/components/resetPassword/resetPassword";



export default async function ResetPasswordPage() {
  // if (await isUserAuthenticated()) redirect("/dashboard");
  
  return (
    <>
          <ResetPassword></ResetPassword>
    </>
  );
}