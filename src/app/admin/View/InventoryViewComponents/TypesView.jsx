import React, { useState } from "react";
import AddTypesForm from "./AddTypesForm";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ListTypesView from "./ListTypesView";
import { fetchCollection, updateDocument } from "@/app/lib/firebase/firebase";
import EditModal from "@/app/components/EditModal";
import AcceptModal from "@/app/components/AcceptModal";

function TypesView({ onBack }) {
  const [form, setForm] = useState("");
  const [categorie, setCategorie] = useState("types");
  const [data, setData] = useState({});
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const [editItem, setEditItem] = useState(null);

  const handleEdit = (item) => {
    setEditItem(item);
    onEditModalOpen();
  };

  const handleDelete = (item) => {
    setEditItem(item);
    onDeleteModalOpen();
  };

  const handleRemoveField = async () => {
    setData(editItem.data);
    const { index } = editItem;
    const key = Object.keys(editItem.data)[index];

    // Creamos una copia del estado actual
    const updatedData = { ...editItem.data };
    // Eliminamos el campo del objeto
    delete updatedData[key];
    console.log(updatedData);
    console.log(editItem.data[key]);

    try {
      console.log(updatedData);
      await updateDocument("categories", categorie, updatedData);
      setData(updatedData); // Actualiza el estado con los datos modificados
      // Obtener los documentos de la otra colección que necesitan ser actualizados
      const productsSnapshot = await fetchCollection("inventory");

      if (productsSnapshot) {
        // Crear un array de promesas para actualizar cada documento
        const updatePromises = productsSnapshot.map(async (doc) => {
          const productData = doc.data;
          // Eliminamos el campo del objeto
          if (
            categorie === "types" &&
            productData.type === editItem.data[key]
          ) {
            delete productData.type;
          }
          if (
            categorie === "colors" &&
            productData.color === editItem.data[key]
          ) {
            delete productData.color;
          }
          if (
            categorie === "subCategories" &&
            productData.subCategory === editItem.data[key]
          ) {
            delete productData.subCategory;
          }
          console.log(productData);
          return updateDocument("inventory", doc.uid, productData);
        });

        // Esperar a que todas las actualizaciones se completen
        await Promise.all(updatePromises);
      } else {
        console.log("No se encontraron documentos en la colección 'products'");
      }
    } catch (error) {
      console.error("Error al actualizar el documento en Firebase:", error);
    }
  };

  const handleSaveEdit = async (newValue) => {
    setData(editItem.data);
    const { index, value } = editItem;
    const key = Object.keys(editItem.data)[index];

    const updatedData = { ...editItem.data, [key]: newValue };
    console.log(updatedData);

    try {
      await updateDocument("categories", categorie, updatedData);
      setData(updatedData); // Actualiza el estado con los datos modificados
      // Obtener los documentos de la otra colección que necesitan ser actualizados
      const productsSnapshot = await fetchCollection("inventory");

      if (productsSnapshot.length > 0) {
        // Crear un array de promesas para actualizar cada documento
        const updatePromises = productsSnapshot.map(async (doc) => {
          const productData = doc.data;
          // Suponiendo que el campo que quieres actualizar en "products" es el mismo que el de "categories"

          if (categorie === "types" && productData.type === value) {
            productData.type = newValue;
          }
          if (categorie === "colors" && productData.color === value) {
            productData.color = newValue;
          }
          if (
            categorie === "subCategories" &&
            productData.subCategory === value
          ) {
            productData.subCategory = newValue;
          }
          console.log("New productData", productData);
          return updateDocument("inventory", doc.uid, productData);
        });

        // Esperar a que todas las actualizaciones se completen
        await Promise.all(updatePromises);
      } else {
        console.log("No se encontraron documentos en la colección 'products'");
      }
    } catch (error) {
      console.error("Error al actualizar el documento en Firebase:", error);
    }
  };

  const handleOnBack = () => {
    onBack();
  };

  return (
    <div className="container">
      <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-center mb-4">
          <h3 className="text-2xl font-bold mb-4">Agregar Categorias</h3>
          <a className=" text-sm text-gray-500 text-center">
            Agrega los tipos, colores y subcategorias que desees.
          </a>
          <br />
          <a className=" text-sm text-gray-500 text-center">
            Seleccione el tipo de categoria que desea agregar.
          </a>
        </div>
        <div className="mt-5 mb-4 grid grid-cols-3 gap-4">
          <Button
            onClick={() => {
              setForm("addType"), setCategorie("types");
            }}
          >
            Tipo
          </Button>
          <Button
            onClick={() => {
              setForm("addColor"), setCategorie("colors");
            }}
          >
            Color
          </Button>
          <Button
            onClick={() => {
              setForm("addSubCategory"), setCategorie("subCategories");
            }}
          >
            Subcategorías
          </Button>
        </div>
        <AddTypesForm form={form} />
        <ListTypesView
          type={categorie}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EditModal
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          onSave={handleSaveEdit}
          message="Recuerde que al momento de editar el nombre se cambiará en todos los prodcutos que pertenezcan a esta categoría"
          initialValue={editItem ? editItem.name : ""}
        />
        <AcceptModal
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onSave={handleRemoveField}
          tittleModal="Eliminar Categoria"
          message="¿Estás seguro que deseas eliminar esta categoria?"
        />
        <div className="text-center">
          <Button
            className="bg-red-400 hover:bg-red-600 text-white font-bold col-span-2"
            onClick={handleOnBack}
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TypesView;
