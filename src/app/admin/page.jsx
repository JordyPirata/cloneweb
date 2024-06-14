"use client";
import React, { useState } from "react";
import styles from "./Admin.module.css";
import { Button, Divider, Image } from "@nextui-org/react";
import UserView from "./View/UserView";
import InventoryView from "./View/InventoryView";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/context/authContext";

function Admin() {
  const router = useRouter();
  const { userDB } = useAuth();
  const [formType, setFormType] = useState("users");

  return (
    <div className="relative bg-white shadow-md overflow-auto min-h-full p-2 rounded-3xl mt-2">
      <div className="grid grid-cols-4 bg-white ">
        {/* Opciones de administración */}
        <div className="bg-gray-200 rounded-tl-3xl rounded-bl-3xl min-h-screen max-w-80 shadow-md p-3">
          <div className={`p-6 flex flex-col justify-center items-center `}>
            <div className={styles.profilePictureContainer}></div>
            <h2 className="text-sm text-center font-semibold">Administrador</h2>
            <h2 className="text-center font-semibold">
              {userDB.name} {userDB.lastname}
            </h2>
          </div>
          <Divider className={`mt-10 mb-2 ${styles.divider}`} />
          <div className={` p-6 flex flex-col justify-center gap-3`}>
            <h2 className="text-lg font-bold mb-4 text-center">
              Opciones de Administración
            </h2>
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={() => setFormType("users")}
            >
              Usuarios
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={() => setFormType("inventory")}
            >
              Inventario
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={() => setFormType("sales")}
            >
              Ventas
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={() => setFormType("return")}
            >
              Volver
            </Button>
          </div>
        </div>
        {/* Contenido de administración */}
        <div className="col-span-3 justify-center items-center ">
          {formType === "users" && <UserView />}
          {formType === "inventory" && <InventoryView onSales="false" />}
          {formType === "sales" && <InventoryView onSales="true" />}
          {formType === "return" && router.push("/")}
        </div>
      </div>
    </div>
  );
}

export default Admin;
