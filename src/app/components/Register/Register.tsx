'use client'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/services/auth/auth.client";
import { useRedirectAfterLogin } from "@/shared/hooks/useRedirectAfterLogin";
import { Button, Divider, Image, Input, Link, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogginIn, setIsLoggingIn] = useState(false);

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const formRef = useRef<any>(null);
    const redirectAfterLogin = useRedirectAfterLogin();

    const register = async (e: any) => {
        try {
            e.preventDefault();
            setLoading(true);
            setMessage('');
            const formData = new FormData(e.target);
            const formEntries: any = Object.fromEntries(formData);

            await signUpWithEmail(formEntries);

            setMessage('Cuenta creada con éxito, iniciando sesión...');
            
            await signInWithEmail(formEntries.email, formEntries.password);

            redirectAfterLogin();
            
            e.target.reset();
            
        } catch (error: any) {
            console.log(error)
            setMessage(error);
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            <div>
                <p className={`text-xl font-bold text-primary text-center w-full`}>Crear Cuenta</p>
                <form ref={formRef} onSubmit={register}>
                    <div className="flex flex-col gap-4 my-4 text-black">
                        <Input isRequired type="text" label="Numero de documento" name="document" required variant="bordered" />
                        <Input isRequired type="text" label="Numero de afiliado" name="affiliateNumber" required variant="bordered" />
                        <Input type="email" label="Email" name="email" isRequired variant="bordered" />
                        <Input
                            name="password"
                            className="flex items-center"
                            label="Contraseña"
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
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                        />

                        <Input
                            className={`flex items-center`}
                            name="repeatPassword"
                            label="Repita Contraseña"
                            variant="bordered"
                            required
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={()=> setShowPasswordRepeat(!showPasswordRepeat)}>
                                    {showPasswordRepeat ? (
                                        <Image src="/img/icons/eye-slash.svg" alt="eye-view" width={24} height={24} />
                                    ) : (
                                        <Image src="/img/icons/eye-view.svg" alt="eye-slash" width={24} height={24} />
                                    )}
                                </button>
                            }
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            isInvalid={!!repeatPassword && password !== repeatPassword}
                            type={showPasswordRepeat ? "text" : "password"}
                            color={!repeatPassword ? "default" : password !== repeatPassword ? "danger" : "success"}
                        />

                        <Button className={`btn text-white`} type="submit">
                            <div className="flex items-center justify-center gap-3">
                                <Spinner className={`${loading ? 'block' : 'hidden'}`} size="sm" color="white" />
                                <span>Crear cuenta</span>
                            </div>
                        </Button>
                        {message && <p className={`text-black text-center`}>{message}</p>}
                        <Link type="reset" href="/login">Ya tengo cuenta</Link>
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

export default Register;