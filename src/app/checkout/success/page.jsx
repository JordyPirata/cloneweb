import { LogoMercadoLibre } from "@/app/components/icons/LogoMercadoLibre";
import { Button } from "@nextui-org/react";
import React from "react";

function success() {
  return (
    <div className="relative bg-white shadow-md overflow-auto min-h-screen p-2 rounded-3xl mt-2">
      <div className=" bg-white ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-green-600">
            Tu pedido ha sido procesado exitosamente.
          </p>
          <LogoMercadoLibre size={300} color={"#008000	"} />
          <Button className="bg-red-500 hover:bg-red-700 text-white font-bold">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default success;
