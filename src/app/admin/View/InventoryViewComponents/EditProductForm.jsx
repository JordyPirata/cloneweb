import React, { useRef, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Alert } from "@/app/components/Alert";
import { validateString } from "@/app/utilites/utlites";
import { CameraIcon } from "@/app/components/icons/CameraIcon";
import { parseDate, today } from "@internationalized/date";
import Carousel from "@/app/components/Carousel";
import {
  deleteProduct,
  updateProductField,
  uploadMultipleFiles,
} from "@/app/lib/firebase/firebase";
import CategorySelect from "@/app/utilites/CategorySelect";

function EditProductForm({ product, onBack }) {
  const [alert, setAlert] = useState(null);
  const [alertType, setAlertType] = useState("error");
  const fileRef = useRef();
  const [files, setFiles] = useState([]);
  const [productData, setProductData] = useState(product.data);
  const [type, setType] = useState([
    { label: "Accesorios", value: "Accesorio" },
    { label: "Piezas", value: "Pieza" },
  ]);

  const handleChangeSelect = (e) => {
    const { name, value } = e;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(e);
  };

  const handleChange = (e, isChecked, fieldName) => {
    const { name, value, type } = e.target;
    console.log(e.target.name);

    if (type === "checkbox") {
      setProductData((prevData) => ({
        ...prevData,
        [fieldName]: isChecked,
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    console.log(productData);
  };

  const handleSubmit = async (e) => {
    setAlert("");
    console.log(productData);
    e.preventDefault();
    if (
      product.data.name === productData.name &&
      !files.length > 0 &&
      product.data.amount === productData.amount &&
      product.data.color === productData.color &&
      product.data.price === productData.price &&
      product.data.publicPrice === productData.publicPrice &&
      product.data.modifier === productData.modifier &&
      product.data.saleAvailable === productData.saleAvailable &&
      product.data.subCategory === productData.subCategory &&
      product.data.trialPeriod === productData.trialPeriod &&
      product.data.description === productData.description &&
      product.data.type === productData.type &&
      product.data.visible === productData.visible
    ) {
      setAlertType("error");
      setAlert("No hay cambios para guardar");
      return;
    }
    try {
      const productImageURL = await uploadMultipleFiles(
        "im_ProductPictures",
        files,
        product.uid
      );
      setProductData((prevData) => ({
        ...prevData,
        productPictures: productImageURL,
      }));
      const keys = Object.keys(productData);
      for (const key of keys) {
        await updateProductField(product.uid, key, productData[key]);
        console.log("Campo actualizado:", key, productData[key]);
      }

      setAlertType("success");
      setAlert("Producto agregado correctamente");
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlert("Hubo un error al agregar el producto");
    }
  };

  const handleOnBack = () => {
    onBack();
  };

  const handleOpenFilePicker = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  function isDateExpired(expirationDate) {
    const currentDate = today();
    const parsedExpirationDate = parseDate(expirationDate);

    // Compara la fecha actual con la fecha de vencimiento
    return currentDate <= parsedExpirationDate;
  }

  const handleDeleteProduct = async () => {
    if (!product.uid) {
      setAlertType("error");
      setAlert("No se puede eliminar el producto");
      return;
    }

    if (isDateExpired(productData.trialPeriod)) {
      setAlertType("error");
      setAlert(
        "No se puede eliminar un producto con periodo de prueba sin vencer"
      );
      return;
    }

    if (!window.confirm("¿Estás seguro que deseas eliminar este producto?")) {
      return;
    }

    try {
      await deleteProduct(product.uid);
      setAlertType("success");
      setAlert("Producto eliminado correctamente");
      onBack();
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlert("Hubo un error al eliminar el producto");
    }
  };

  return (
    <div className="container">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {alert && (
          <Alert
            type={alertType}
            message={alert}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={(e) =>
              validateString(e.target.value)
                ? (handleChange(e), setAlert(""))
                : setAlert(
                    "El nombre no puede contener caracteres especiales ni ser mayor a 50 caracteres"
                  )
            }
            className="form-input"
            aria-label="name"
            isRequired
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Cantidad:
          </label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={productData.amount}
            onChange={handleChange}
            className="form-input"
            aria-label="amount"
            isRequired
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Color:</label>
          <CategorySelect
            isRequired
            categoryType="colors"
            onSelect={(color) => {
              handleChangeSelect(color);
            }}
            selectedOption={productData.color}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Precio:</label>
          <Input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="form-input"
            aria-label="price"
            isRequired
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Precio público:
          </label>
          <Input
            type="number"
            id="publicPrice"
            name="publicPrice"
            value={productData.publicPrice}
            onChange={handleChange}
            className="form-input"
            aria-label="publicPrice"
            isRequired
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Modificador:
          </label>
          <Input
            type="text"
            id="modifier"
            name="modifier"
            value={productData.modifier}
            onChange={(e) =>
              validateString(e.target.value)
                ? (handleChange(e), setAlert(""))
                : setAlert(
                    "El Modificador no puede contener caracteres especiales ni ser mayor a 50 caracteres"
                  )
            }
            className="form-input"
            aria-label="modifier"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Venta disponible:{" "}
            <Checkbox
              id="saleAvailable"
              name="saleAvailable"
              checked={productData.saleAvailable}
              isSelected={productData.saleAvailable}
              onChange={(e) => handleChange(e, e.target.checked, e.target.name)}
              className="form-checkbox"
              aria-label="saleAvailable"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Subcategoría:
          </label>
          <CategorySelect
            isRequired
            categoryType="subCategories"
            onSelect={(subCategory) => {
              handleChangeSelect(subCategory);
            }}
            selectedOption={productData.subCategory}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Período de prueba:
          </label>
          <DatePicker
            onChange={(date) =>
              setProductData((prevData) => ({
                ...prevData,
                trialPeriod: date.toString(),
              }))
            } // Actualiza el estado con la fecha seleccionada
            showMonthAndYearPickers
            locale="es"
            className="input"
            isRequired
            aria-label="trialPeriod"
            value={parseDate(productData.trialPeriod)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Descripción:
          </label>
          <Input
            type="text"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="form-input"
            aria-label="description"
            isRequired
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Tipo:</label>
          <CategorySelect
            isRequired
            categoryType="types"
            onSelect={(type) => {
              handleChangeSelect(type);
            }}
            selectedOption={productData.type}
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">
            Visible:{" "}
            <Checkbox
              id="visible"
              name="visible"
              checked={productData.visible}
              isSelected={productData.visible}
              onChange={(e) => handleChange(e, e.target.checked, e.target.name)}
              className="form-checkbox"
              size="lg"
              aria-label="visible"
            />
          </label>
        </div>
        <div className="mb-4">
          <Carousel
            images={
              productData.productPictures
                ? productData.productPictures
                : "no_image.svg"
            }
          />
        </div>
        <div className="mb-4 grid grid-cols-2">
          <Button
            className="col-span-2"
            onClick={handleOpenFilePicker}
            endContent={<CameraIcon />}
          >
            Subir fotos del producto
          </Button>
          <input
            className="hidden"
            ref={fileRef}
            type="file"
            multiple
            onChange={(e) => {
              setFiles(e.target.files);
              console.log("Archivo seleccionado:", e.target.files);
            }}
          />
        </div>
        <div className="text-center grid grid-cols-2 gap-5 mb-5">
          <Button
            onClick={handleOnBack}
            className="bg-red-400 hover:bg-red-600 text-white font-bold"
          >
            Volver
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-red-400 hover:bg-red-600 text-white font-bold"
          >
            Guardar Producto
          </Button>
        </div>
        <div className="mb-4 grid grid-cols-2">
          <Button
            onClick={handleDeleteProduct}
            className="bg-red-400 hover:bg-red-600 text-white font-bold col-span-2"
          >
            Eliminar Producto
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;
