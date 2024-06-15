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
  Image,
  Input,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { LowPriceIcon } from "./components/icons/low-price-product";
import { BuyProtected } from "./components/icons/buy-protected";
import { TopSale } from "./components/icons/top-sale";
import { RegistrationDa } from "./components/icons/registration-da";
import { Location } from "./components/icons/location";
import { LogoMercadoLibre } from "./components/icons/LogoMercadoLibre";
import { useEffect, useState } from "react";
import CarouselLarge from "./components/carouselLarge";
import Navbar from "./components/navbar";
import { fetchProducts } from "./lib/firebase/firebase";
import ModalDetailsProduct from "./products/Components/ModalDetailsProduct";
import { useCart } from "./lib/context/CartContext";
import { useRouter } from "next/navigation";

export default function Component() {
  const [hydrated, setHydrated] = useState(false);
  const images = [
    "https://main.cdn.wish.com/web/84b24f0fd4e9/img/first_purchase_incentive/desktop_banner_background.png",
    "https://canary.contestimg.wish.com/api/file/fetch?general_image_name=zb-iim-6660f1f496208e44c68369d1-1717629428-2024_05_Pool_Day_Fashion_Favorites_Web_Banner_Primary_Promo_Desktop_HP1_Template.png",
  ];

  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cart } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const showAlert = (message, delay) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, delay); // El mensaje desaparecerá después de 3 segundos
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchProductsData();
    setHydrated(true);
  }, []);

  const handleAddToCart = (product) => {
    console.log("product", product);
    if (!product) return;

    const maxQuantity = product.data.amount; // Máximo de productos que se pueden agregar al carrito
    const cartItem = cart.find((item) => item.itemId === product.uid); // Buscar si el producto ya está en el carrito

    if (cartItem) {
      // Si el producto ya está en el carrito, verificar si se puede agregar más
      if (cartItem.quantity >= maxQuantity) {
        showAlert(
          "No puedes añadir más de este producto. Solo hay " +
            maxQuantity +
            " en stock. Y ya tienes " +
            cartItem.quantity +
            " en el carrito.",
          3000
        );
        return;
      }
    }

    if (product.data.amount <= 0) {
      showAlert("No hay suficiente stock para añadir este producto.", 1000);
      return;
    }

    addToCart(product.uid);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onOpenChange(false);
  };

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
          <CarouselLarge images={images} size={5000} />
        </div>

        <div className="grid grid-cols-5 gap-4 pb-8">
          <Card
            className="bg-white"
            isPressable
            onPress={() => {
              router.push("/login");
            }}
          >
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
              <Button
                color="primary"
                variant="flat"
                onClick={() => router.push("/login")}
              >
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

          <Card
            className="bg-white"
            isPressable
            onPress={() => router.push("/products")}
          >
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

          <Card
            className="bg-white"
            isPressable
            onPress={() => router.push("/products")}
          >
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
            <h2 className="text-2xl font-bold">Productos en venta</h2>
            <LayoutGridIcon className="text-black" />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {products.map((product, index) => (
              <Card key={index} className="w-full">
                <CardBody>
                  <div className="grid grid-cols-1 justify-items-center">
                    <Image
                      src={
                        product.data.productPictures &&
                        product.data.productPictures.image0
                          ? product.data.productPictures.image0
                          : "/no_image.svg"
                      }
                      width={200}
                      height={200}
                      alt="Product"
                    />
                    <p>{product.data.name}</p>
                    <p>${product.data.publicPrice}</p>
                    <Button
                      variant="ghost"
                      onClick={() => handleViewDetails(product)}
                    >
                      Ver producto
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
            {selectedProduct && (
              <ModalDetailsProduct
                product={selectedProduct}
                isOpen={isOpen}
                onClose={handleCloseModal}
                onAddCart={handleAddToCart}
              />
            )}
            {alertMessage && (
              <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
                {alertMessage}
              </div>
            )}
          </div>
        </section>
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
