"use client";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
  Input,
  Progress,
} from "@nextui-org/react";
import Image from "next/image";
import { LowPriceIcon } from "./components/icons/low-price-product";
import { BuyProtected } from "./components/icons/buy-protected";
import { TopSale } from "./components/icons/top-sale";
import { RegistrationDa } from "./components/icons/registration-da";
import { Location } from "./components/icons/location";
import { LogoMercadoLibre } from "./components/icons/LogoMercadoLibre";
import { useEffect, useState } from "react";
import Carousel from "./components/carousel";
import Navbar from "./components/navbar";

export default function Component() {
  const [hydrated, setHydrated] = useState(false);
  const images = [
    "https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1717445259308-abr24mlmhotsalepreviakvcelebritydescuentomsidesktopx340px2x.png",
    "https://http2.mlstatic.com/storage/splinter-admin/1717431495033-mercadolibredesktopsinfechas.png",
  ];

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-full">
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Cargando..."
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar>
        <div className="py-8">
          <Carousel images={images} size={5000} />
        </div>
        <div className="grid grid-cols-5 gap-4 pb-8">
          <Card className="bg-white" isPressable>
            <CardHeader className="justify-center">
              <div className="grid grid-cols-1 justify-items-center">
                <p className="text-left">Ingresar a tu cuenta</p>
                <RegistrationDa className="h-12 w-12 justify-self-center" />
              </div>
            </CardHeader>
            <CardBody className="text-center">
              <p>Disfruta de ofertas y compra sin límites</p>
            </CardBody>
            <CardFooter className="justify-center">
              <Button color="primary" variant="flat">
                Ingresar a tu cuenta
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white" isPressable>
            <CardHeader className="justify-center">
              <div className="grid grid-cols-1 justify-items-center">
                <p className="text-left">Ingresa tu ubicación</p>
                <Location className="h-12 w-12 justify-self-center" />
              </div>
            </CardHeader>
            <CardBody className="text-center">
              <p>Consulta costos y tiempos de entrega</p>
            </CardBody>
            <CardFooter className="justify-center">
              <Button color="primary" variant="flat">
                Ingresa ubicación
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white" isPressable>
            <CardHeader className="justify-center">
              <div className="grid grid-cols-1 justify-items-center">
                <p className="text-center">Menos de $500</p>
                <LowPriceIcon
                  size={window.innerWidth < 768 ? 100 : 150}
                  className="h-12 w-12 justify-self-center"
                />
              </div>
            </CardHeader>
            <CardBody className="text-center justify-items-center">
              <p>Descubre productos con precios bajos</p>
            </CardBody>
            <CardFooter className="justify-center">
              <Button color="primary" variant="flat">
                Mostrar productos
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white" isPressable>
            <CardHeader className="justify-center">
              <div className="grid grid-cols-1 justify-items-center">
                <p className="text-center">Más vendidos</p>
                <TopSale size={150} className="h-12 w-12 justify-self-center" />
              </div>
            </CardHeader>
            <CardBody className="text-center">
              <p>Explora los productos que son tendencia</p>
            </CardBody>
            <CardFooter className="justify-center">
              <Button color="primary" variant="flat">
                Ir a Más vendidos
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white" isPressable>
            <CardHeader className="justify-center">
              <div className="grid grid-cols-1 justify-items-center">
                <p className="text-center">Compra protegida</p>
                <BuyProtected
                  size={150}
                  className="h-12 w-12 justify-self-center"
                />
              </div>
            </CardHeader>
            <CardBody className="text-center">
              <p>Puedes devolver tu compra gratis</p>
            </CardBody>
            <CardFooter className="justify-center">
              <Button color="primary" variant="flat">
                Cómo funciona
              </Button>
            </CardFooter>
          </Card>
        </div>
        <section className="bg-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Oferta del día</h2>
            <Button variant="ghost">Ofertas</Button>
            <Button variant="ghost">Mostrar todas las ofertas</Button>
            <LayoutGridIcon className="text-black" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="w-full">
                <CardBody>
                  <div className="grid grid-cols-1 justify-items-center">
                    <Image
                      src="/placeholder.svg"
                      width={200}
                      height={200}
                      alt="Product"
                    />
                    <p>Product Name</p>
                    <p>$ Price</p>
                    <Button variant="ghost">Ver producto</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
        <footer className="py-4">
          <p className="text-center text-sm text-black">Oferta del día</p>
          <div className="flex justify-center space-x-4">
            <Link href="#" className="text-sm text-black" prefetch={false}>
              Ofertas
            </Link>
            <Link href="#" className="text-sm text-black" prefetch={false}>
              Mostrar todas las ofertas
            </Link>
          </div>
        </footer>
      </Navbar>
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function LayoutGridIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
