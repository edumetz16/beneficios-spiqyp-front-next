import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <>
        <div className="hidden lg:block mt-10 bg-primary pt-10 pb-20">
            <div className="container">
            <div className="grid grid-cols-12 items-start">
                <div className="col-span-4 flex flex-col items-start justify-center">
                    <h2 className="text-lg text-white">Sindicato del Personal de la Industria Química y Petroquímica</h2>
                </div>
                <div className="col-span-8 flex flex-col items-end justify-center">
                    <div className="flex flex-col text-white items-end">
                    <p className="text-end"><b>Dirección:</b> Suarez 171, Avellaneda (1870), Buenos Aires, Argentina</p>
                    <p className="text-end"><b>Teléfonos:</b> <Link href={"tel:4204-3572"}>4204-3572</Link></p>
                    <p><b>Whatsapp/celular (turismo):</b> <Link href={"https://wa.me/1121584187"}>11-2158-4187</Link></p>
                    <p><b>Whatsapp/celular (gremiales):</b> <Link href={"https://wa.me/1122187526"}>11-2218-7526</Link></p>
                    </div>
                </div>
            </div>
            <hr className="my-4"/>
            <div className="flex gap-4 items-center justify-between w-full ">
                {/* <Image src={"/img/logos/logo.png"} alt={""} width={100} height={100} /> */}
                
                <p>© {new Date().getFullYear()} SPIQyP. Todos los derechos reservados</p>
                <p className="text-xs">Desarrollado por <Link href={"https://lineadgroup.com/"} className="underline">LineaD Group</Link></p>
            </div>
            </div>
        </div>
        
        </>
    )
} 

export default Footer;