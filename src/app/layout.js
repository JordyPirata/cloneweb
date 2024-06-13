import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/navbar";
import { WindowSizeProvider } from "./lib/context/WindowSizeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mercado Libre",
  description: "25 años de Mercado Libre",
  image: "/LogoMercadoLibre.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light">
      <body className={inter.className}>
        <Providers>
          <WindowSizeProvider>{children}</WindowSizeProvider>
        </Providers>
      </body>
    </html>
  );
}
