import { Button, Image, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

function Navbar({ children }) {
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
            <Link href="#" className="text-black">
              Crea tu cuenta
            </Link>
            <Link href="#" className="text-black">
              Ingresa
            </Link>
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
              Categorías
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Ofertas
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Historial
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Supermercado
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Moda
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
              Mercado Play
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-black" prefetch={false}>
              Vender
            </Link>
            <Link href="#" className="text-black" prefetch={false}>
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
