"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { UserIcon } from "./icons/UserIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { useAuth } from "../lib/context/authContext";
import { useRouter } from "next/navigation";
import { CartIcon } from "./icons/CartIcon";
import { useCart } from "../lib/context/CartContext";
import Cart from "./Cart";

function Navbar({ children }) {
  const { user, userDB, logout } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cart } = useCart();

  const handleOpenCart = () => {
    onOpen();
  };

  const handleCloseCart = () => {
    onOpenChange(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 min-h-screen">
        <header className="flex justify-between items-center py-4">
          <div>
            <Image
              onClick={() => router.push("/")}
              src="\Wish-Logo.png"
              alt="logo"
              width={75}
              height={75}
            />
          </div>
          <div className="relative flex-1 px-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="¿Qué quieres encontrar?"
                className="w[80%]"
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
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
                    {userDB.userType === "admin" && (
                      <DropdownItem color="primary" variant="solid">
                        <Link href="/admin" className="text-black">
                          Administración
                        </Link>
                      </DropdownItem>
                    )}
                    <DropdownItem color="primary" variant="bordered">
                      <Link href="/orders" className="text-black">
                        Mis compras
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
                <Link href="/register" className="text-blue-400">
                  Inicia sesión
                </Link>
                <Link
                  href="/login"
                  className="text-blue-400"
                  style={{ marginLeft: "10px" }}
                >
                  Ingresa
                </Link>
              </div>
            )}
            <Button
              variant="light"
              onClick={handleOpenCart}
              className="text-black"
            >
              <div className="  bg-gray-600 text-white rounded-full w-5 h-5 flex justify-center items-center">
                {totalItems}
              </div>
              <CartIcon size="30px" />
            </Button>
          </div>
        </header>
        <nav className="flex justify-between items-center py-2">
          <div className="flex space-x-4">
            <Link href="/products" className="text-black" prefetch={false}>
              Productos
            </Link>
            <Link href="/mercadomusic" className="text-black" prefetch={false}>
              Music
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
        <Cart isOpen={isOpen} onClose={handleCloseCart} />
        {children}
      </div>
    </div>
  );
}

export default Navbar;
