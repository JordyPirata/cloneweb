import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export async function POST(req) {
  const protocol = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("x-forwarded-host");
  const baseUrl = `${protocol}://${host}`;

  const body = await req.json();
  const cartItems = body.cartItems;
  const user = body.user;

  const lineItems = cartItems.map((cartItem) => {
    return {
      price_data: {
        currency: "mxn",
        product_data: {
          name: cartItem.details.data.name, // Suponiendo que tienes el nombre del producto en los detalles del carrito
          images: [cartItem.details.data.productPictures.image0], // Suponiendo que tienes la imagen del producto en los detalles del carrito
        },
        unit_amount: cartItem.details.data.publicPrice * 100, // Suponiendo que tienes el precio del producto en los detalles del carrito y en centavos
      },
      quantity: cartItem.quantity,
    };
  });

  const metadata = {
    userId: user.uid,
    cartItems: JSON.stringify(
      cartItems.map((cartItem) => ({
        uid: cartItem.itemId,
        quantity: cartItem.quantity,
      }))
    ),
  };

  const session = await stripe.checkout.sessions.create({
    success_url: baseUrl + "/checkout/success",
    cancel_url: baseUrl + "/checkout",
    line_items: lineItems,
    metadata: metadata,
    mode: "payment",
  });

  return NextResponse.json(session);
}
