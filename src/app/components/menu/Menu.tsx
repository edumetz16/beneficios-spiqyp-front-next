
'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Search from "../search/search";
import { Divider, Listbox, ListboxItem, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { MenuAccount } from "./MenuAccount";


const Menu = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        "Categorias",
    ];


   
    return (
        <Navbar className="text-black py-4" maxWidth="xl" height={120}>
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
            />
            <NavbarBrand>
                <Link href="/">
                    <Image className="" src={"/img/logos/logo_spiqyp.png"} alt={"logo"} width={80} height={80}/>
                </Link>
            </NavbarBrand>

            <NavbarContent justify="center" className="grow w-full max-w-lg">
            <div className="hidden lg:flex justify-center h-fit max-h-8 grow w-full">
                <Search/>
            </div>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <MenuAccount />
                </NavbarItem>
                </NavbarContent>
                <NavbarMenu>
                    {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="text-black">
                        <Link
                        color={
                            index === 0 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                        }
                        className="w-full"
                        href="#"
                        >
                        {item}
                        </Link>
                    <Divider className="my-4" />
                    </NavbarMenuItem>
                    ))}
                        <Listbox
                            className="text-black"
                            aria-label="Actions"
                            onAction={(key) => alert(key)}
                        >
                            <ListboxItem key="restaurants">Restaurantes</ListboxItem>
                            <ListboxItem key="turismo">Turismo</ListboxItem>
                        </Listbox>
                </NavbarMenu>

        </Navbar>
        
    )
}

export default Menu;