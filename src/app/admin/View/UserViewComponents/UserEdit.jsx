import { Button, Image, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import UserTypeLabel from "./UserViewHelpers/UserTypeLabel";
import { Alert } from "@/app/components/Alert";
import PopupConfirmPassword from "@/app/components/PopupConfirmPassword";
import { updateUserField } from "@/app/lib/firebase/firebase";
import { validateString } from "@/app/utilites/utlites";

function UserEdit({ userData, onBack }) {
  const [userState, setUserState] = useState(userData.data.blocked);
  const [userType, setUserType] = useState(userData.data.userType);
  const [userName, setUserName] = useState(userData.data.name);
  const [userLastName, setUserLastName] = useState(userData.data.lastname);
  const typesOfUsers = [
    { value: "admin", label: "Administrador" },
    { value: "specialist", label: "Especialista" },
    { value: "repairman", label: "RescueRepair" },
    { value: "user", label: "Cliente" },
  ];
  const states = [
    { value: true, label: "Activo" },
    { value: false, label: "Inactivo" },
  ];
  const [alert, setAlert] = useState(null);
  const [alertType, setalertType] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleUserState = (e) => {
    if (e.target.value === "true") {
      setUserState(true);
    } else if (e.target.value === "false") {
      setUserState(false);
    }
  };

  const handleUserType = (e) => {
    setUserType(e.target.value);
    console.log(e.target.value);
  };

  const handlePopUpSave = () => {
    setPopupMessage("¿Estás seguro de que deseas guardar esta dirección?");
    setShowPopup(true);
  };

  const handleSaveChange = async (user) => {
    setAlert(null);
    try {
      setShowPopup(false);
      console.log(user);
      if (!user.name || !user.lastname || !user.userType) {
        setAlert("Por favor, completa todos los campos.");
        setalertType("error");
        return;
      }

      if (
        user.name === userData.data.name &&
        user.lastname === userData.data.lastname &&
        user.userType === userData.data.userType &&
        user.state === userData.data.blocked
      ) {
        setAlert("No se han realizado cambios.");
        setalertType("error");
        return;
      }

      console.log("Guardando cambios:", userData);
      const keys = Object.keys(user);
      for (const key of keys) {
        console.log("Guardando campo:", key, user[key]);
        await updateUserField(userData.uid, key, user[key]);
      }

      setAlert("Cambios guardados correctamente.");
      setalertType("success");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setAlert("Error al guardar los cambios.");
      setalertType("error");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="">
      {showPopup && (
        <PopupConfirmPassword
          message={popupMessage}
          onConfirm={() =>
            handleSaveChange({
              name: userName,
              lastname: userLastName,
              userType: userType,
              blocked: userState,
            })
          }
          onCancel={() => {
            setShowPopup(false);
          }}
        />
      )}
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Editar Usuario
      </h1>
      {alert && (
        <Alert
          type={alertType}
          message={alert}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="grid grid-cols-2 items-center gap-2">
        <div className="flex flex-col items-center">
          <Image
            src={
              userData.data.profilePicture
                ? userData.data.profilePicture
                : "/UserProfilePicture.svg"
            }
            alt={userData.data.name || userData.data.email}
            isBlurred={true}
            className="h-20 w-20 rounded-full border-gray-200 border-2"
          />
          <p className="text-lg font-semibold">{userData.data.name}</p>
          <p className="text-gray-500">{userData.data.email}</p>
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold">Nombre(s)</label>
          <Input
            type="text"
            className="p-2"
            value={userName}
            onChange={(e) => {
              const newValue = e.target.value;

              if (validateString(newValue)) {
                setUserName(newValue);
                setAlert(null);
              } else {
                setAlert(
                  "*El Nombre no puede contener caracteres especiales \n ni ser mayor a 50 caracteres*"
                );
                setalertType("error");
              }
            }}
          />
          <label className="text-lg font-semibold">Apellido(s)</label>
          <Input
            type="text"
            className="p-2"
            value={userLastName}
            onChange={(e) => {
              const newValue = e.target.value;

              if (validateString(newValue)) {
                setUserLastName(newValue);
                setAlert(null);
              } else {
                setAlert(
                  "*Los Apellidos no puede contener caracteres especiales \n ni ser mayor a 50 caracteres*"
                );
                setalertType("error");
              }
            }}
          />
          <label className="text-lg font-semibold">
            Tipo de Usuario:{" "}
            {
              <a className="text-red-400">
                {<UserTypeLabel userType={userType} />}
              </a>
            }
          </label>
          <Select
            value={userType}
            aria-label="Estatus del usuario"
            placeholder="Estatus del usuario"
            className="p-2"
            onChange={handleUserType}
          >
            {typesOfUsers.map((typeOfUser) => (
              <SelectItem key={typeOfUser.value} value={typeOfUser.value}>
                {typeOfUser.label}
              </SelectItem>
            ))}
          </Select>
          <label className="text-lg font-semibold">
            Estado:{" "}
            {!userState ? (
              <a className="text-green-600">Activo</a>
            ) : (
              <a className="text-red-500">Inactivo</a>
            )}
          </label>
          <Select
            aria-label="Estatus del usuario"
            placeholder="Estatus del usuario"
            className="p-2"
            onChange={handleUserState}
          >
            {states.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="mt-2 col-span-2 grid grid-cols-3">
          <div className="col-star-1">
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={handleBack}
            >
              Volver
            </Button>
          </div>
          <div className="col-start-2">
            <Button
              className="bg-red-500 hover:bg-red-700 text-center text-white font-bold rounded-xl"
              onClick={handlePopUpSave}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;
