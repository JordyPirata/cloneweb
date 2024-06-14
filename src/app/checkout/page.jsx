"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
import { useCart } from "../lib/context/CartContext";
import { MinusIcon } from "../components/icons/MinusIcon";
import { PlusIcon } from "../components/icons/PlusIcon";
import { delay } from "framer-motion";
import { useAuth } from "../lib/context/authContext";
import { MapPinIcon } from "../components/icons/MapPinIcon";
import { PaymentRounded } from "@material-ui/icons";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const {
    cart,
    addToCart,
    removeFromCart,
    getProductById,
    removeItemFromCart,
  } = useCart();
  const [editCart, setEditCart] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { user, userDB } = useAuth();
  const [address, setAddress] = useState(userDB.address);

  const [newAddress, setNewAddress] = useState(false);

  useEffect(() => {
    const fetchCartDetails = async () => {
      const details = await Promise.all(
        cart.map(async (item) => {
          const product = await getProductById(item.itemId);
          return { ...item, details: product };
        })
      );
      setCartItems(details);
    };
    fetchCartDetails();
  }, [cart, getProductById]);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.details.data.publicPrice * item.quantity,
      0
    );
  };

  const handlePlaceOrder = async () => {
    console.log(cartItems);
    {
      /*Comprobar si los productos estan en stock */
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        cartItems,
        user,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const session = await res.json();

    window.location = session.url;
  };

  console.log(cartItems);
  const shipping = 5.0;
  const taxes = calculateSubtotal() * 0.08; // Asumiendo un 8% de impuestos

  const handleEditCart = () => {
    setEditCart(!editCart);
  };

  const showAlert = (message, delay) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, delay); // El mensaje desaparecerá después de 3 segundos
  };

  const handleAddItem = (item, stock) => {
    if (stock <= 0) {
      showAlert("No hay en stock para añadir este producto.", 2000);
      return;
    } else if (stock >= 1) {
      if (item.quantity >= stock) {
        showAlert(
          "No puedes añadir más de este producto. solo hay " +
            stock +
            " en stock.",
          2000
        );
        return;
      }
    }
    addToCart(item.itemId);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.itemId);
  };

  const handleAddresChange = (address) => {
    setAddress(address);
    console.log(address);
  };

  return (
    <div className="relative bg-white shadow-md overflow-auto min-h-screen p-2 rounded-3xl mt-2">
      <div className=" bg-white ">
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[1fr_600px]">
          <div className="flex flex-col border-r bg-gray-100/40 p-6 dark:bg-gray-800/40 lg:p-10">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="text-2xl font-bold">Pago</h1>
              <Button
                className={`text-sm bg-transparent  ${
                  editCart ? "text-red-500" : "text-blue-500"
                }`}
                prefetch={false}
                onClick={handleEditCart}
              >
                Editar Carrito
              </Button>
            </div>
            <div className="flex-1 space-y-6 py-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Resumen de la orden
                </h2>
                {alertMessage && (
                  <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
                    {alertMessage}
                  </div>
                )}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            item.details.data.productPictures &&
                            item.details.data.productPictures.image0
                              ? item.details.data.productPictures.image0
                              : "/no_image.svg"
                          }
                          width={64}
                          height={64}
                          alt="Product Image"
                          className="rounded-md"
                        />
                        <div>
                          <h3 className="font-medium">
                            {item.details.data.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.details.data.modifier}
                          </p>
                        </div>
                      </div>

                      {editCart && (
                        <div className="justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleRemoveItem(item, item.details.data.amount)
                            }
                          >
                            <MinusIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 justify-items-center">
                        <span className="text-xs">Cantidad:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>

                      {editCart && (
                        <div className="justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleAddItem(item, item.details.data.amount)
                            }
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>{" "}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid grid-cols-1">
                          <span className="text-xs">Unidad:</span>
                          <span className="text-md">
                            ${item.details.data.publicPrice}
                          </span>
                        </div>
                        <div className="grid grid-cols-1">
                          <span className="text-xs">Total:</span>
                          <span className="font-medium">
                            ${item.details.data.publicPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Divider />
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Total de la Orden:
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${calculateSubtotal()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Envío</span>
                    <span className="font-medium">${shipping}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Impuestos</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      ${(calculateSubtotal() + shipping + taxes).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6 p-6 lg:p-10">
            {/*Metodo de envio */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">Metodo de envío</h2>
              <CheckboxGroup>
                <Checkbox>1 - 7 días (express)</Checkbox>
                <Checkbox>7 - 15 días (rapído)</Checkbox>
                <Checkbox>7 - 22 días (normal)</Checkbox>
              </CheckboxGroup>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold">Metodo de Pago</h2>
            </div>
            <Button onClick={handlePlaceOrder} className="w-full">
              <PaymentRounded />
              Pagar con tarjeta de debito/credito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
