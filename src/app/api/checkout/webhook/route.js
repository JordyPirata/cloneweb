import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { headers } from "next/headers";
import Stripe from "stripe";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export async function POST(req) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.error(error.message, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { userId, cartItems } = session.metadata;

      // Agregar pedido a Firebase
      const collectionRef = collection(db, "orders");
      await addDoc(collectionRef, {
        userId,
        cartItems: JSON.parse(cartItems),
        date: new Date(),
        amount: session.amount_total / 100,
        paymentId: session.payment_intent,
        status: "paid",
      });

      const cartItemsList = JSON.parse(cartItems);
      // Actualizar inventario
      await Promise.all(
        cartItemsList.map(async (item) => {
          const productRef = doc(db, "inventory", item.uid);
          const productSnapshot = await getDoc(productRef);
          const productData = productSnapshot.data();

          if (productData) {
            // Restar la cantidad comprada del inventario
            await updateDoc(productRef, {
              amount: `${productData.amount - parseInt(item.quantity, 10)}`,
            });
          } else {
            console.log(
              `Error: El producto con uid ${item.uid} no existe en el inventario`
            );
          }
        })
      );

      // Vaciar Carrito
      const userRef = doc(db, "carts", userId);
      const items = [];
      const cart = await updateDoc(userRef, {
        items: items,
      });

      console.log("Pedido agregado a Firebase y el inventario actualizado.");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
