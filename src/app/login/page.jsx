import { Button, Image, Input } from "@nextui-org/react";
import React from "react";
import { useWindowSize } from "../lib/context/WindowSizeContext";

function Login() {
  const { width, height } = useWindowSize();

  return (
    <div>
      {width < 768 ? (
        <div className="bg-white">
          <header className="flex justify-between items-center py-2 bg-[#ffe600]">
            <div>
              <Image
                src="/LogoMercadoLibre.png"
                alt="logo"
                width={125}
                height={125}
                className="p-2"
              />
            </div>
          </header>
          <div className="container mx-auto px-4 min-h-screen text-center py-4">
            <h1 className="font-semibold text-2xl">
              Ingresa tu e-mail, teléfono o usuario de Mercado Libre
            </h1>
            <div className="flex justify-center items-center py-4">
              <Input
                type="text"
                label="E-mail, teléfono o usuario"
                labelPlacement="outside"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-center items-center py-4">
              <Button className="w-full" color="primary">
                Continuar
              </Button>
            </div>
            <div className="flex justify-center items-center -mt-4 ">
              <Button variant="light" color="primary" className="w-full">
                Crear cuenta
              </Button>
            </div>
          </div>
          <footer className="justify-center items-center py-4 bg-white">
            <div className="grid grid-cols-2 justify-between max-w-4xl mx-auto">
              <div className="flex justify-center">
                <p className="text-xs mx-2">
                  <a href="#" className="text-blue-500">
                    Cómo cuidamos tu privacidad
                  </a>{" "}
                  - Copyright © 1999-2024 DeRemate.com de México S. de R.L. de
                  C.V.
                </p>
              </div>
              <div className="flex justify-center">
                <p className="text-xs mx-2">
                  <a href="#" className="text-blue-500">
                    Protegido por reCAPTCHA
                  </a>{" "}
                  -{" "}
                  <a href="#" className="font-semibold">
                    Privacidad
                  </a>{" "}
                  -{" "}
                  <a href="#" className="font-semibold">
                    Condiciones
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <div> hola puto</div>
      )}
    </div>
  );
}

export default Login;
