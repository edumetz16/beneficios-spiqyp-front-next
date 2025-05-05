'use client'
import { sendPasswordReset, signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/services/auth/auth.client";
import { useRedirectAfterLogin } from "@/shared/hooks/useRedirectAfterLogin";
import { Button, Divider, form, Image, Input, Link, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogginIn, setIsLoggingIn] = useState(false);

    const formRef = useRef<any>(null);
    const router = useRouter();


    const handleForm = async (e: any) => {
        try {
            e.preventDefault();
            setLoading(true);
            setMessage('');
            
            const formData = new FormData(e.target);
            const formEntries: any = Object.fromEntries(formData);

            await sendPasswordReset(formEntries.email);

            setMessage('Se ha enviado un correo para restablecer la contraseña');
        } catch (error: any) {
            console.log(error.code)
            setMessage(error);
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            <div>
                <p className={`text-xl font-bold text-primary text-center w-full`}>Reestablecer contraseña</p>
                <p className={`mt-2 text-sm text-gray-500 text-left w-full`}>Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.</p>
                <form ref={formRef} onSubmit={handleForm}>
                    <div className="flex flex-col gap-4 my-4 text-black">
                        <Input type="email" label="Email" name="email" required variant="bordered" />

                        <Button className={`btn text-white ${isSignUp ? 'hidden' : 'block'}`} type="submit">
                            <div className="flex items-center justify-center gap-3">
                                <Spinner className={`${loading ? 'block' : 'hidden'}`} size="sm" color="white" />
                                <span>Reestablecer contraseña</span>
                            </div>

                        </Button>
                        {message && <p className={`text-black text-center`}>{message}</p>}
                        <Button type="reset" href="/login">Volver</Button>
                        <Link type="reset" href="/register">¿No tenés cuenta? Registrate.</Link>
                    </div>
                </form>


            </div>
        </>
    )
}

export default ResetPassword;