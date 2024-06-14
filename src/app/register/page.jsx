"use client";
import Head from "next/head";
import React, { useState } from "react";
import { useWindowSize } from "../lib/context/WindowSizeContext";
import { Button, Image, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { registerDocNewUser, registerNewUser } from "../lib/firebase/firebase";

function Register() {
  const { width, height } = useWindowSize();
  const [user, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [confirmPass, setConfirmPass] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const handleRegister = async () => {
    console.log("register");
    try {
      if (user.password != confirmPass) {
        alert("Contraseñas no coinciden");
      } else {
        const res = await registerNewUser(user.email, user.password);
        const userRegister = await registerDocNewUser(user, res.user.uid);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
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
      </header>{" "}
      {width > 768 ? (
        <div className="flex justify-center min-h-screen bg-gray-100">
          <Head>
            <title>Cuadro Centrado</title>
            <meta name="description" content="Cuadro centrado en la pantalla" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="bg-white mt-20  px-4 py-4 w-[536px] h-[421px] shadow-lg flex items-center justify-center rounded-lg">
            <div className="grid grid-cols-1 text-center gap-3">
              <h1 className="text-xl">
                Completa los datos para crear tu cuenta
              </h1>

              <Input
                id="name"
                value={user.name}
                type="text"
                placeholder="Nombre"
                variant="bordered"
                onChange={handleChange}
              />
              <Input
                id="lastName"
                value={user.lastName}
                type="text"
                placeholder="Apellido"
                variant="bordered"
                onChange={handleChange}
              />
              <Input
                id="email"
                value={user.email}
                type="text"
                placeholder="E-mail"
                variant="bordered"
                onChange={handleChange}
              />
              <Input
                id="password"
                value={user.password}
                type="password"
                placeholder="Contraseña"
                variant="bordered"
                onChange={handleChange}
              />
              <Input
                id="confirmPass"
                onChange={(e) => setConfirmPass(e.target.value)}
                value={confirmPass}
                type="password"
                placeholder="Repetir contraseña"
                variant="bordered"
              />
              <Button color="primary" onClick={handleRegister}>
                Registrar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white mt-20  px-4 py-4 min-h-screen   items-center justify-center rounded-lg">
          <div className="grid grid-cols-1 text-center gap-3">
            <h1 className="text-xl">Completa los datos para crear tu cuenta</h1>

            <Input
              id="name"
              value={user.name}
              type="text"
              placeholder="Nombre"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              id="lastName"
              value={user.lastName}
              type="text"
              placeholder="Apellido"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              id="email"
              value={user.email}
              type="text"
              placeholder="E-mail"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              id="password"
              value={user.password}
              type="password"
              placeholder="Contraseña"
              variant="bordered"
              onChange={handleChange}
            />
            <Input
              value={confirmPass}
              id="confirmPass"
              onChange={(e) => setConfirmPass(e.target.value)}
              type="password"
              placeholder="Repetir contraseña"
              variant="bordered"
            />
            <Button color="primary" onClick={handleRegister}>
              Registrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
