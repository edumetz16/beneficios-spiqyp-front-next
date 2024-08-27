import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Spinner } from "@nextui-org/react"

import { useAuth } from "@/app/auth/AuthContext";
import { signOut } from "@/services/auth/auth.client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export const MenuAccount = () => {
  const router = useRouter();

  const { user } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    console.log('logging out');
    setIsLoggingOut(true);
    await signOut();
    console.log('logged out out');
    console.log(user);
    router.refresh();
    setIsLoggingOut(false);
  }

  // useMemo(() => { console.log(user) }, [user]);

  return (
    <>
      {user ?
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {isLoggingOut ? <Spinner />:
             <Avatar
              as="button"
              className={`transition-transform`}
              name={`${user.displayName || ''}`}
              size="sm"
              src={`${user.photoURL || ''}`}
            />}
          </DropdownTrigger>
          <DropdownMenu className="text-black" aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Inicio sesion como</p>
              <p className="font-semibold">{`${user.email || ''}`}</p>
            </DropdownItem>
            <DropdownItem key="settings">Perfil</DropdownItem>
            <DropdownItem key="help_and_feedback">Ayuda</DropdownItem>
            <DropdownItem key="logout" color="danger">
              <Link href="/" onClick={() => logout()}>Cerrar Sesion</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> : <Button as={Link} color="primary" href="/login/" variant="flat">
          Ingresar
        </Button>}
    </>
  )
}