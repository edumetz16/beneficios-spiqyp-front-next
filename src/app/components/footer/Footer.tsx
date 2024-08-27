import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <>
        <div className="mt-10 bg-primary py-20">
            <div className="container">
            <div className="grid grid-cols-12 items-start">
                <div className="col-span-4 flex flex-col items-start justify-center">
                    <h2 className="uppercase text-2xl font-bold text-white">SPIQyP</h2>
                    <div className="flex flex-col text-white">
                        <Link href={"https://spiqyp.org.ar/"}>Inicio</Link>
                        <Link href={"https://spiqyp.org.ar/nosotros/"}>Nosotros</Link>
                        <Link href={"#"} className="sf-with-ul">Beneficios<i className="sf-sub-indicator fa fa-caret-down"></i></Link>
                        <ul className="sub-menu" style={{ display: "none" }}>
                            <li><Link href={"https://spiqyp.org.ar/cultura/"}>Cultura</Link></li>
                            <li><Link href={"https://spiqyp.org.ar/turismo-promos/"}>Turismo</Link></li>
                            <li><Link href={"https://spiqyp.org.ar/beneficios/"}>Más Beneficios</Link></li>
                        </ul>
                        <Link href={"https://spiqyp.org.ar/noticias/"}>Noticias</Link>
                        <Link href={"https://spiqyp.org.ar/formularios/"}>Formularios</Link>
                        <Link href={"https://spiqyp.org.ar/afiliarse-a-spiqyp/"}>Afiliarse!</Link>
                        <Link href={"https://spiqyp.org.ar/contactenos/"}>Contacto</Link>
                    </div>
                </div>
                <div className="col-span-4 flex flex-col items-center justify-center">
                    {/* <h2 className="uppercase text-2xl font-bold text-white">Title</h2>
                    <div className="flex flex-col text-white">
                        <Link href={""}>LINK 1</Link>
                        <Link href={""}>LINK 1</Link>
                        <Link href={""}>LINK 1</Link>
                    </div> */}
                </div>
                <div className="col-span-4 flex flex-col items-end justify-center">
                    <h2 className="uppercase text-2xl font-bold text-white">Contacto</h2>
                    <div className="flex flex-col text-white items-end">
                    <p><b>Dirección:</b> Suarez 171, Avellaneda (1870), Buenos Aires, Argentina</p>
                    <p><b>Teléfonos:</b> <Link href={"tel:4204-3572"}>4204-3572</Link></p>
                    <p><b>Whatsapp/celular (turismo):</b> <Link href={"https://wa.me/1121584187"}>11-2158-4187</Link></p>
                    <p><b>Whatsapp/celular (gremiales):</b> <Link href={"https://wa.me/1122187526"}>11-2218-7526</Link></p>
                    </div>
                </div>
            </div>
            <hr className="my-4"/>
            <div className="flex gap-4 items-center justify-center w-full ">
                {/* <Image src={"/img/logos/logo.png"} alt={""} width={100} height={100} /> */}
                
                <p>© {new Date().getFullYear()} LineaD. Todos los derechos reservados</p>
            </div>
            </div>
        </div>
        
        </>
    )
} 

export default Footer;