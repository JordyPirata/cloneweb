// PopupConfirmPassword.js

import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuth } from "../lib/context/authContext";
import { Input } from "@nextui-org/react";

const PopupConfirmPassword = ({ message, onConfirm, onCancel }) => {
  const { user, reauthenticateWithPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(true);

  const handleConfirm = async () => {
    try {
      const isAuth = await reauthenticateWithPassword(user.email, password);
      console.log(isAuth);
      if (isAuth === true) {
        onConfirm();
        setShow(false);
      } else {
        setErrorMessage(
          "Error al verificar la contraseña. Inténtalo de nuevo."
        );
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Contraseña incorrecta. Inténtalo de nuevo.");
      } else {
        setErrorMessage(
          "Error al verificar la contraseña. Inténtalo de nuevo."
        );
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    setShow(false);
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${show ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="mt-3">
            <a className="text-xl font-extrabold px-4 text-red-600">
              {message}
            </a>
            <div className="mt-8 justify-center flex items-center">
              <Input
                type="password"
                label='"Ingrese su contraseña para confirmar"'
                labelPlacement="outside"
                placeholder="Contraseña"
                className="px-3 py-2 rounded-md w-64 mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 justify-center">
            <button
              onClick={handleConfirm}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmPassword;
