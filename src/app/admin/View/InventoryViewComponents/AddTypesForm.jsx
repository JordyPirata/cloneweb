import { Alert } from "@/app/components/Alert";
import {
  addCollectionDocument,
  addFieldNtoDocument,
  addFieldToDocument,
  addSubcollectionDocument,
  updateCollectionDocument,
} from "@/app/lib/firebase/firebase";
import { validateString } from "@/app/utilites/utlites";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";

function AddTypesForm({ form }) {
  const [alert, setAlert] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const handleSubmit = async () => {
    try {
      if (form === "addType") {
        await addFieldNtoDocument("categories", "types", "type", type);
      }
      if (form === "addColor") {
        await addFieldNtoDocument("categories", "colors", "color", color);
      }
      if (form === "addSubCategory") {
        await addFieldNtoDocument(
          "categories",
          "subCategories",
          "subCategory",
          subCategory
        );
      }
      setAlert("Categoria agregada correctamente");
      setAlertType("success");
      setType("");
      setColor("");
      setSubCategory("");
    } catch (error) {
      console.error(error);
      setAlert("Error al agregar la categoria \n" + error);
      setAlertType("error");
    }
  };

  return (
    <div className="container">
      <div>
        {alert && (
          <Alert
            type={alertType}
            message={alert}
            onClose={() => setAlert(null)}
          />
        )}
        {form === "addType" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tipo:</label>
            <Input
              type="text"
              id="type"
              name="type"
              value={type}
              onChange={(e) =>
                validateString(e.target.value)
                  ? (setType(e.target.value), setAlert(""))
                  : setAlert(
                      "El tipo no puede contener caracteres especiales ni ser mayor a 50 caracteres"
                    )
              }
              className="form-input"
              aria-label="type"
              isRequired
            />
          </div>
        )}
        {form === "addColor" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Color:</label>
            <Input
              type="text"
              id="color"
              name="color"
              value={color}
              onChange={(e) =>
                validateString(e.target.value)
                  ? (setColor(e.target.value), setAlert(""))
                  : setAlert(
                      "El color no puede contener caracteres especiales ni ser mayor a 50 caracteres"
                    )
              }
              className="form-input"
              aria-label="color"
              isRequired
            />
          </div>
        )}
        {form === "addSubCategory" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Subcategorías:
            </label>
            <Input
              type="text"
              id="subCategory"
              name="subCategory"
              value={subCategory}
              onChange={(e) =>
                validateString(e.target.value)
                  ? (setSubCategory(e.target.value), setAlert(""))
                  : setAlert(
                      "La subcategoria no puede contener caracteres especiales ni ser mayor a 50 caracteres"
                    )
              }
              className="form-input"
              aria-label="subCategory"
              isRequired
            />
          </div>
        )}
        <div className="mb-4 grid grid-cols-2">
          <Button
            onClick={handleSubmit}
            className="bg-red-400 hover:bg-red-600 text-white font-bold col-span-2"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddTypesForm;
