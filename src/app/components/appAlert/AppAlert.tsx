"use client";

import { getCurrentUser } from "@/services/auth/auth.client";
import { Alert, Button } from "@heroui/react";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";

export const AppAlert = () => {
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  setInterval(async () => {
    const user = await getCurrentUser();
    if(user) {
      setIsEmailVerified(user.emailVerified);
    }
  }, 1000);
  const sendVerification = async () => {
    setSendingVerification(true);
    const user = await getCurrentUser();
    if(user) {
      await sendEmailVerification(user);
    }
    setVerificationSent(true);
    setSendingVerification(false);
  }
  return (
    <>
    {!isEmailVerified && 
      <Alert color="danger" description="Su correo no está validado" title="Por favor valide su correo" 
                endContent={
                  <Button isLoading={sendingVerification} disabled={verificationSent} onPress={() => sendVerification()} color="danger" size="sm" variant="flat">
                    Enviar correo de validación
                  </Button>
                }/>
    }
    </>
  )
}