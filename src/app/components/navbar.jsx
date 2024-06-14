import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { useAuth } from "../lib/context/authContext";

function Navbar({ children }) {
  const { user, userDB, logout } = useAuth();
  return (
    <div className="bg-gradient-to-b from-[#ffe600] via-slate-50 to-slate-50">
      <div className="container mx-auto px-4 min-h-screen">
        <header className="flex justify-between items-center py-4">
          <div>
            <Image
              src="/LogoMercadoLibre.png"
              alt="logo"
              width={200}
              height={200}
            />
          </div>
          <div className="flex-1 px-4">
            <Input
              type="search"
              placeholder="Buscar productos, marcas y más..."
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <p className="text-black">{userDB.name}</p>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem color="primary" variant="bordered">
                      <Link href="/profile" className="text-black">
                        Mi perfil
                      </Link>
                    </DropdownItem>
                    <DropdownItem color="danger" onClick={() => logout()}>
                      <a>Cerrar Sesion</a>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <div>
                <Link href="/register" className="text-black">
                  Crea tu cuenta
                </Link>
                <Link href="/login" className="text-black">
                  Ingresa
                </Link>
              </div>
            )}
            <Link href="#" className="text-black">
              Mis compras
            </Link>
            <Button variant="outline" className="bg-white">
              Suscríbete
            </Button>
          </div>
        </header>
        <nav className="flex justify-between items-center py-2">
          <div className="flex space-x-4">
            <Link href="#" className="text-black" prefetch={false}>
              Productos
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Mercado Music
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.mercadolibre.com.mx/vender"
              className="text-black"
              prefetch={false}
            >
              Vender
            </Link>
            <Link
              href="https://www.mercadolibre.com.mx/ayuda"
              className="text-black"
              prefetch={false}
            >
              Ayuda
            </Link>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}

export default Navbar;
