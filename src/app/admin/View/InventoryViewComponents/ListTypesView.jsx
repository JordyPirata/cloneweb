import { SearchIcon } from "@/app/components/icons/SearchIcon";
import {
  fetchCollection,
  fetchDocument,
  fetchSubcollection,
} from "@/app/lib/firebase/firebase";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

function ListTypesView({ type, onEdit, onDelete }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Función para obtener los datos de Firebase
    const fetchData = async () => {
      try {
        // Realizar la consulta a Firestore según el tipo recibido
        const items = await fetchDocument("categories", type);
        console.log("items", items);
        setData(items);
      } catch (error) {
        console.error("Error al obtener datos de Firebase:", error);
      }
    };

    // Llamar a la función para obtener los datos cuando el componente se monte
    fetchData();

    // Cleanup de la suscripción en caso de desmontar el componente
    return () => {
      // Aquí puedes realizar alguna acción de limpieza si es necesario
    };
  }, [type]); // Ejecutar el efecto cada vez que cambie el tipo

  // Función para filtrar los datos basándose en el término de búsqueda
  const filteredData = Object.values(data).filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-5">
        <h2 className="text-2xl font-bold mb-4 text-center capitalize">
          {type === "types" && "Tipos"}
          {type === "colors" && "Colores"}
          {type === "subCategories" && "Subcategorías"}
        </h2>
        <div className="w-[340px]">
          <Input
            isClearable
            radius="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Escribe para buscar.."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
        </div>
      </div>
      <ul className="space-y-2">
        {filteredData.map((value, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded shadow hover:bg-gray-100 transition duration-300 grid grid-cols-3 gap-2"
          >
            {value}

            <Button
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => onEdit({ data, index, value })}
            >
              Editar
            </Button>
            <Button
              className="bg-red-400 hover:bg-red-600 text-white font-bold"
              onClick={() => onDelete({ data, index, value })}
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListTypesView;
