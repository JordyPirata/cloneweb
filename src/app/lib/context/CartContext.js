// context/CartContext.js
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./authContext";
import { db, fetchProducts } from "../firebase/firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const loadCartFromFirestore = useCallback(async () => {
    if (user) {
      const cartDocRef = doc(db, "carts", user.uid);
      const cartDoc = await getDoc(cartDocRef);
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items);
      } else {
        setCart([]);
      }
    }
  }, [user]);

  useEffect(() => {
    loadCartFromFirestore();
  }, [user, loadCartFromFirestore]);

  const saveCartToFirestore = useCallback(
    async (updatedCart) => {
      if (user) {
        const cartDocRef = doc(db, "carts", user.uid);
        await setDoc(cartDocRef, { items: updatedCart }, { merge: true });
      }
    },
    [user]
  );

  const addToCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.itemId === itemId);

      if (existingItem) {
        // Si el elemento ya existe en el carrito, se actualiza la cantidad
        const updatedCart = prevCart.map((item) => {
          if (item.itemId === itemId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

        saveCartToFirestore(updatedCart);
        return updatedCart;
      } else {
        // Si el elemento no existe en el carrito, se agrega con cantidad 1
        const newItem = { itemId, quantity: 1 };
        const updatedCart = [...prevCart, newItem];
        saveCartToFirestore(updatedCart);
        return updatedCart;
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.itemId === itemId);

      if (existingItem) {
        // Si el artículo existe en el carrito
        if (existingItem.quantity > 1) {
          // Si la cantidad es mayor que 1, reducir la cantidad
          const updatedCart = prevCart.map((item) => {
            if (item.itemId === itemId) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          });

          saveCartToFirestore(updatedCart);
          return updatedCart;
        } else {
          // Si la cantidad es 1, eliminar el artículo del carrito
          const updatedCart = prevCart.filter((item) => item.itemId !== itemId);

          saveCartToFirestore(updatedCart);
          return updatedCart;
        }
      } else {
        // Si el artículo no existe en el carrito, no hacer nada
        return prevCart;
      }
    });
  };

  const removeItemFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.itemId !== itemId);

      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const getProductById = async (itemId) => {
    const products = await fetchProducts();
    const product = products.find((product) => product.uid === itemId);
    return product;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getProductById,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
