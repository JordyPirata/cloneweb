import { Alert } from "@/app/components/Alert";
import { CameraIcon } from "@/app/components/icons/CameraIcon";
import {
  addProduct,
  updateProductField,
  uploadMultipleFiles,
} from "@/app/lib/firebase/firebase";
import CategorySelect from "@/app/utilites/CategorySelect";
import { validateString } from "@/app/utilites/utlites";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

const AddProductForm = ({ onBack }) => {
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const fileRef = useRef();
  const [files, setFiles] = useState([]);
  const [type, setType] = useState([
    { label: "Accesorios", value: "Accesorio" },
    { label: "Piezas", value: "Pieza" },
  ]);

  const [productData, setProductData] = useState({
    name: "",
    amount: "",
    color: "",
    price: "",
    publicPrice: "",
    productPictures: [],
    modifier: "",
    saleAvailable: false,
    subCategory: "",
    trialPeriod: "",
    description: "",
    type: "",
    visible: false,
  });

  const handleChangeSelect = (e) => {
    const { name, value } = e;
    console.log(e);
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (e, isChecked, fieldName) => {
    const { name, value, type } = e.target;

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(productData);
    try {
      const productID = await addProduct(productData);
      console.log("Producto agregado:", productID);
      console.log("Archivos a subir:", files);
      const productImageURL = await uploadMultipleFiles(
        "im_ProductPictures",
        files,
        productID
      );
      console.log("Imagen subida:", productImageURL);
      await updateProductField(productID, "productPictures", productImageURL);
      setAlertType("success");
      setAlert("Producto agregado correctamente");
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlert("Hubo un error al agregar el producto");
    }
  };

  const handleOpenFilePicker = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleOnBack = () => {
    onBack();
  };

  return (
    <div className="container">
      <form
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
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
            categoryType="colors"
            onSelect={(color) => {
              handleChangeSelect(color);
            }}
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
            categoryType="subCategories"
            onSelect={(subCategory) => {
              handleChangeSelect(subCategory);
            }}
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
            categoryType="types"
            onSelect={(type) => {
              handleChangeSelect(type);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">
            Visible:{" "}
            <Checkbox
              id="visible"
              name="visible"
              checked={productData.visible}
              onChange={(e) => handleChange(e, e.target.checked, e.target.name)}
              className="form-checkbox"
              size="lg"
              aria-label="visible"
            />
          </label>
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
        <div className="text-center grid grid-cols-2 gap-5">
          <Button
            onClick={handleOnBack}
            className="bg-red-400 hover:bg-red-600 text-white font-bold"
          >
            Volver
          </Button>
          <Button
            type="submit"
            className="bg-red-400 hover:bg-red-600 text-white font-bold"
          >
            Agregar Producto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
