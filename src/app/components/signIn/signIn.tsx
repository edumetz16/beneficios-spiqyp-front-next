'use client'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/services/auth/auth.client";
import { useRedirectAfterLogin } from "@/shared/hooks/useRedirectAfterLogin";
import { Button, Divider, Image, Input, Link, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogginIn, setIsLoggingIn] = useState(false);

    const formRef = useRef<any>(null);
    const router = useRouter();

    const redirectAfterLogin = useRedirectAfterLogin();

    const handleSignIn = async (authMethod: number) => {
        let isOk = false;
        switch (authMethod) {
            case 1: {
                await signInWithGoogle();
                redirectAfterLogin();
            }
            default: {

            }
        }

    };

    const handleForm = async (e: any) => {
        try {
            e.preventDefault();
            setLoading(true);
            setMessage('');
            
            const formData = new FormData(e.target);
            const formEntries: any = Object.fromEntries(formData);

            await signInWithEmail(formEntries.email, formEntries.password);

            redirectAfterLogin();
            
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
                <p className={`text-xl font-bold text-primary text-center w-full`}>Iniciar sesion</p>
                <form ref={formRef} onSubmit={handleForm}>
                    <div className="flex flex-col gap-4 my-4 text-black">
                        <Input className="hidden" type="text" name="operation" value={`${isSignUp ? 'signUp' : 'login'}`} />
                        <Input type="email" label="Email" name="email" required variant="bordered" />
                        <Input
                            name="password"
                            className="flex items-center"
                            label="Password"
                            variant="bordered"
                            required
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={()=>setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <Image src="/img/icons/eye-slash.svg" alt="eye-view" width={24} height={24} />
                                    ) : (
                                        <Image src="/img/icons/eye-view.svg" alt="eye-slash" width={24} height={24} />
                                    )}
                                </button>
                            }
                            type={showPassword ? "text" : "password"}
                        />

                        <Button className={`btn text-white ${isSignUp ? 'hidden' : 'block'}`} type="submit">
                            <div className="flex items-center justify-center gap-3">
                                <Spinner className={`${loading ? 'block' : 'hidden'}`} size="sm" color="white" />
                                <span>Iniciar sesion</span>
                            </div>

                        </Button>
                        <Button className={`btn text-white ${isSignUp ? 'block' : 'hidden'}`} type="submit">
                            <div className="flex items-center justify-center gap-3">
                                <Spinner className={`${loading ? 'block' : 'hidden'}`} size="sm" color="white" />
                                <span>Crear cuenta</span>
                            </div>
                        </Button>
                        {message && <p className={`text-black text-center`}>{message}</p>}
                        <Button >¿Olvidaste tu contraseña?</Button>
                        <Link type="reset" href="/register">¿No tenés cuenta? Registrate.</Link>
                    </div>
                </form>
                {/* <div className="grid grid-cols-12 justify-center items-center">
                    <div className="col-span-4"><Divider></Divider></div>
                    <div className="col-span-4 text-black text-center"><p>Ó con tus redes sociales</p></div>
                    <div className="col-span-4"><Divider></Divider></div>
                </div>
                <div className="flex flex-col items-center mt-4 gap-4">
                    <Button className="w-full lg:w-1/2 bg-transparent border border-black" startContent={<Image src="/img/icons/logo-google.svg" alt="google" width={24} height={24} />} onClick={x => { handleSignIn(1) }}>Iniciar sesion con Google</Button>
                    <Button className="w-full lg:w-1/2 bg-transparent border border-black" startContent={<Image src="/img/icons/facebook-logo.svg" alt="google" width={24} height={24} />}>Iniciar sesion con Facebook</Button>
                    <Button className="w-full lg:w-1/2 bg-transparent border border-black" startContent={<Image src="/img/icons/apple-logo.svg" alt="google" width={24} height={24} />}>Iniciar sesion con Apple</Button>
                </div> */}


            </div>
        </>
    )
}

export default SignIn;