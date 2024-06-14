// components/Footer.js
"use client";
import React, { useEffect, useState } from "react";
import { fetchCollection } from "../lib/firebase/firebase";

export default function Footer() {
  const [address, setAddress] = useState([]);
  useEffect(() => {
    // Función para obtener los datos de Firebase
    const fetchData = async () => {
      try {
        // Realizar la consulta a Firestore según el tipo recibido
        const data = await fetchCollection("shopAddress");
        console.log("Shop Address:", data);
        setAddress(data);
      } catch (error) {
        console.error("Error al obtener datos de Firebase:", error);
      }
    };

    // Llamar a la función para obtener los datos cuando el componente se monte
    fetchData();
  }, []);

  return (
    <footer className="justify-center items-center py-7 bg-gray-100">
      <div className="grid grid-cols-3 justify-between max-w-4xl mx-auto">
        <div className="flex justify-center col-span-2">
          <p className="text-[10px] mx-2">
            <a href="#" className="text-blue-500">
              Cómo cuidamos tu privacidad
            </a>{" "}
            - Copyright © 1999-2024 DeRemate.com de México S. de R.L. de C.V.
          </p>
        </div>
        <div className="flex justify-center">
          <p className="text-[10px] mx-2">
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
  );
}
