"use client";
import { Button, Image, Input, Divider } from "@nextui-org/react";
import React, { useState } from "react";
import { useWindowSize } from "../lib/context/WindowSizeContext";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import { CellPhone } from "../components/icons/CellPhone";
import { UserIcon } from "../components/icons/UserIcon";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/context/authContext";

function Login() {
  const { width, height } = useWindowSize();
  const { login } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleRegister = () => {
    console.log("register");
    router.push("/register");
  };

  const handleLogin = async () => {
    try {
      if (user.email === "" || user.password === "") {
        alert("Llena los campos");
      } else {
        const res = await login(user.email, user.password);
        console.log(res);
        router.push("/");
      }
    } catch (error) {}
  };

  return (
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
      {width < 1020 ? (
        <div className="bg-white container mx-auto px-4 min-h-screen ">
          <div className="container mx-auto px-4 min-h-screen text-center py-4">
            <h1 className="font-semibold text-2xl">
              Ingresa tu e-mail, teléfono o usuario de Mercado Libre
            </h1>
            <div className="flex justify-center items-center py-4">
              <Input
                type="text"
                label="E-mail, teléfono o usuario"
                labelPlacement="outside"
                variant="bordered"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex justify-center items-center ">
              <Input
                type="password"
                label="Contraseña"
                variant="bordered"
                labelPlacement="outside"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="flex justify-center items-center py-4">
              <Button className="w-full" color="primary" onClick={handleLogin}>
                Iniciar Sesion
              </Button>
            </div>
            <div className="flex justify-center items-center -mt-4 ">
              <Button
                variant="light"
                color="primary"
                className="w-full"
                onClick={handleRegister}
              >
                Crear cuenta
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white container mx-auto px-8 min-h-screen">
          <div className=" mx-auto px-4 min-h-screen mt-14">
            <div className="grid grid-cols-2 px-4 min-h-screen py-4">
              <div className=" justify-center items-start w-2/3">
                <h1 className="text-3xl">
                  Ingresa tu e-mail, teléfono o usuario de Mercado Libre
                </h1>
                <Divider className="w-3/4 mt-5 mb-5" />
                <div className=" justify-start items-start text-start w-3/4">
                  <h1 className="text-[12px]">Reportar un problema</h1>
                  <div className="w-full">
                    <Button
                      variant="light"
                      className=" text-left text-sm text-gray-500 flex items-center space-x-1 rounded-none"
                    >
                      <CellPhone size={20} />
                      <span>Robo o pérdida de teléfono</span>
                    </Button>
                  </div>
                  <Divider className="w-full mt-[1px] mb-[1px] " />
                  <div className="w-full">
                    <Button
                      variant="light"
                      className=" text-left text-sm text-gray-500 flex items-center space-x-1 rounded-none"
                    >
                      <UserIcon size={20} />
                      <span>Robo o pérdida de teléfono</span>
                    </Button>
                  </div>
                  <p className="text-[12px] text-blue-500">
                    Necesito ayuda con otros temas
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-start">
                <div className="border container px-8 py-8  border-gray-300 rounded-lg p-2">
                  <Input
                    type="text"
                    placeholder=" "
                    variant="bordered"
                    id="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    label="E-mail, teléfono o usuario"
                    labelPlacement="outside"
                    className="mb-4"
                  />
                  <Input
                    type="password"
                    placeholder=" "
                    id="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    variant="bordered"
                    label="Contraseña"
                    labelPlacement="outside"
                    className=""
                  />
                  <div className=" justify-center items-start py-4 grid grid-cols-3 gap-2">
                    <Button
                      color="primary"
                      className="rounded-md"
                      onClick={handleLogin}
                    >
                      Iniciar Sesion
                    </Button>
                    <Button
                      variant="light"
                      color="primary"
                      onClick={handleRegister}
                    >
                      Crear cuenta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}

export default Login;
