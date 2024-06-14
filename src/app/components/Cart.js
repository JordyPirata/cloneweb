import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useCart } from "../lib/context/CartContext";
import { TrashIcon } from "./icons/TrashIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { MinusIcon } from "./icons/MinusIcon";
import { ShoppingCartIcon } from "./icons/ShoppingCartIcon";
import { RescuePhone } from "./icons/RescuePhone";
import { useRouter } from "next/navigation";
import { LogoMercadoLibre } from "./icons/LogoMercadoLibre";
const Cart = ({ isOpen, onClose }) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    getProductById,
    removeItemFromCart,
  } = useCart();
  const [cartDetails, setCartDetails] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCartDetails = async () => {
      const details = await Promise.all(
        cart.map(async (item) => {
          const product = await getProductById(item.itemId);
          return { ...item, details: product };
        })
      );
      setCartDetails(details);
    };
    fetchCartDetails();
  }, [cart, getProductById]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000); // El mensaje desaparecerá después de 3 segundos
  };

  const handleAddItem = (item, stock) => {
    if (stock <= 0) {
      showAlert("No hay en stock para añadir este producto.");
      return;
    } else if (stock >= 1) {
      if (item.quantity >= stock) {
        showAlert(
          "No puedes añadir más de este producto. solo hay " +
            stock +
            " en stock."
        );
        return;
      } else {
        // Si hay suficiente stock y la cantidad no excede el stock
        addToCart(item.itemId);
      }
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.itemId);
  };

  const handleRemove = (itemId) => {
    removeItemFromCart(itemId);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    try {
      router.push(`/checkout`);
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
    >
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 items-center gap-8">
            <h1 className="text-2xl font-bold">Carrito</h1>
            <div className="flex items-center justify-end gap-2">
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="font-medium text-sm">
                {totalItems} Artículos
              </span>
            </div>
          </div>
          {cartDetails.length > 0 ? (
            cartDetails.map((item) => (
              <div
                key={item.itemId}
                className="grid grid-cols-[100px_1fr_auto] items-center gap-4"
              >
                <Image
                  src={
                    item.details.data.productPictures &&
                    item.details.data.productPictures.image0
                      ? item.details.data.productPictures.image0
                      : "/no_image.svg"
                  }
                  alt={item.details.data.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="grid gap-1">
                  <h3 className="font-semibold">{item.details.data.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.details.data.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleRemoveItem(item, item.details.data.amount)
                    }
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <span className="font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleAddItem(item, item.details.data.amount)
                    }
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1">
                    <span className="text-xs">Unidad:</span>
                    <span className="text-md">${item.details.data.price}</span>
                  </div>
                  <div className="grid grid-cols-1">
                    <span className="text-xs">Total:</span>
                    <span className="font-medium">
                      ${item.details.data.price * item.quantity}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.itemId)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 place-items-center">
              <Image src="/LogoMercadoLibre.png" alt="Logo LogoMercadoLibre" />
              <span>
                Tu carrito se encuentra vacío pero no te preocupes, puedes
                explorar más productos
              </span>
            </div>
          )}
          {alertMessage && (
            <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
              {alertMessage}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <span className="font-semibold text-lg">
            SubTotal: $
            {cartDetails.reduce(
              (total, item) => total + item.details.data.price * item.quantity,
              0
            )}
          </span>
          <Button className="uppercase" auto onClick={handleCheckout}>
            Continuar a pagar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Cart;
