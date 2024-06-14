import { SearchIcon } from "@/app/components/icons/SearchIcon";
import { fetchCollection, fetchProducts } from "@/app/lib/firebase/firebase";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  Image,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const ListProductView = ({ onEdit, onAdd, onSales }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    colors: [],
    subCategories: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({
    types: [],
    colors: [],
    subCategories: [],
  });
  const [priceRanges, setPriceRanges] = useState([]);
  const [appliedPriceFilters, setAppliedPriceFilters] = useState([]);

  const calculatePriceRanges = (products, numberOfRanges = 5) => {
    const prices = products
      .map((product) => product.data.publicPrice)
      .filter((publicPrice) => publicPrice !== undefined);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangeSize = (maxPrice - minPrice) / numberOfRanges;

    const ranges = [];
    for (let i = 0; i < numberOfRanges; i++) {
      ranges.push({
        min: Math.round(minPrice + i * rangeSize),
        max: Math.round(minPrice + (i + 1) * rangeSize),
      });
    }

    return ranges;
  };

  useEffect(
    () => {
      const fetchProductsData = async () => {
        try {
          const productsData = await fetchProducts();
          setProducts(productsData);
          const categories = await fetchCollection("categories");

          const types = [
            ...new Set(
              categories
                .filter((category) => category.uid === "types")
                .flatMap((category) => Object.values(category.data || {}))
                .filter((type) => type !== undefined && type !== "")
            ),
          ];

          const colors = [
            ...new Set(
              categories
                .filter((category) => category.uid === "colors")
                .flatMap((category) => Object.values(category.data || {}))
                .filter((color) => color !== undefined && color !== "")
            ),
          ];

          const subCategories = [
            ...new Set(
              categories
                .filter((category) => category.uid === "subCategories")
                .flatMap((category) => Object.values(category.data || {}))
                .filter(
                  (subCategories) =>
                    subCategories !== undefined && subCategories !== ""
                )
            ),
          ];

          const calculatedPriceRanges = calculatePriceRanges(productsData);
          setPriceRanges(calculatedPriceRanges);

          setFilterOptions({
            types,
            colors,
            subCategories,
          });
        } catch (error) {
          console.error("Error fetching users data:", error);
        }
      };

      fetchProductsData();
    },
    [],
    []
  );

  const handleEdit = (e) => {
    onEdit(e);
  };

  const handlePriceFilterChange = (range) => {
    setAppliedPriceFilters((prevFilters) => {
      const isSelected = prevFilters.some(
        (filter) => filter.min === range.min && filter.max === range.max
      );

      if (isSelected) {
        return prevFilters.filter(
          (filter) => filter.min !== range.min || filter.max !== range.max
        );
      } else {
        return [...prevFilters, range];
      }
    });
  };

  const filteredProducts = products.filter((product) => {
    const {
      name,
      type,
      subCategory,
      description,
      amount,
      color,
      modifier,
      price,
      publicPrice,
    } = product.data;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const nameMatch = name && name.toLowerCase().includes(lowerCaseSearchTerm);
    const typeMatch = type && type.toLowerCase().includes(lowerCaseSearchTerm);
    const subCategoryMatch =
      subCategory && subCategory.toLowerCase().includes(lowerCaseSearchTerm);
    const descriptionMatch =
      description && description.toLowerCase().includes(lowerCaseSearchTerm);
    const amountMatch =
      amount && amount.toLowerCase().includes(lowerCaseSearchTerm);
    const colorMatch =
      color && color.toLowerCase().includes(lowerCaseSearchTerm);
    const modifierMatch =
      modifier && modifier.toLowerCase().includes(lowerCaseSearchTerm);
    const priceMatch = price && price.toString().includes(lowerCaseSearchTerm);
    const publicPriceMatch =
      publicPrice && publicPrice.toString().includes(lowerCaseSearchTerm);

    const matchesSearchTerm =
      nameMatch ||
      typeMatch ||
      subCategoryMatch ||
      descriptionMatch ||
      amountMatch ||
      colorMatch ||
      modifierMatch ||
      priceMatch ||
      publicPriceMatch;

    const matchesFilterOptions =
      (!appliedFilters.types.length ||
        appliedFilters.types.includes(product.data.type)) &&
      (!appliedFilters.colors.length ||
        appliedFilters.colors.includes(product.data.color)) &&
      (!appliedFilters.subCategories.length ||
        appliedFilters.subCategories.includes(product.data.subCategory));

    const matchesPriceFilters =
      !appliedPriceFilters.length ||
      appliedPriceFilters.some(
        (range) => publicPrice >= range.min && publicPrice <= range.max
      );

    return matchesSearchTerm && matchesFilterOptions && matchesPriceFilters;
  });

  // Función para manejar los cambios en las opciones de filtro
  // Función para manejar los cambios en los checkboxes de los filtros
  const handleFilterOptionChange = (optionType, optionValue) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [optionType]: prevFilters[optionType].includes(optionValue)
        ? prevFilters[optionType].filter((value) => value !== optionValue)
        : [...prevFilters[optionType], optionValue],
    }));
  };

  return (
    <div className="gap-4">
      <div className="mb-5 grid grid-cols-1 justify-items-center ">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Lista de productos
        </h2>
        <div className="mb-5 grid grid-cols-2 gap-2">
          <Button onClick={() => onAdd("addProduct")} className="mb-5">
            Agregar Producto
          </Button>
          <Button onClick={() => onAdd("categories")} className="mb-5">
            Categorias
          </Button>
        </div>

        <div className="w-[340px] h-[80]">
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
          <div className="mt-4 grid grid-cols-4 gap-40 col-span-1 justify-items-center">
            {onSales.onSales === "false" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tipos</h3>
                {filterOptions.types.map((type) => (
                  <div key={type}>
                    <Checkbox
                      isSelected={appliedFilters.types.includes(type)}
                      onChange={() => handleFilterOptionChange("types", type)}
                    >
                      {type}
                    </Checkbox>
                  </div>
                ))}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">Colores</h3>
              {filterOptions.colors.map((color) => (
                <div key={color}>
                  <Checkbox
                    isSelected={appliedFilters.colors.includes(color)}
                    onChange={() => handleFilterOptionChange("colors", color)}
                  >
                    {color}
                  </Checkbox>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Subcategorías</h3>
              {filterOptions.subCategories.map((subCategory) => (
                <div className="text-md text-left0" key={subCategory}>
                  <Checkbox
                    isSelected={appliedFilters.subCategories.includes(
                      subCategory
                    )}
                    onChange={() =>
                      handleFilterOptionChange("subCategories", subCategory)
                    }
                  >
                    {subCategory}
                  </Checkbox>
                </div>
              ))}
            </div>
            {onSales.onSales === "true" && (
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-2">Precio</h3>
                {priceRanges.map((range, index) => (
                  <div key={index}>
                    <Checkbox
                      className="text-sm f"
                      isSelected={appliedPriceFilters.some(
                        (filter) =>
                          filter.min === range.min && filter.max === range.max
                      )}
                      onChange={() => handlePriceFilterChange(range)}
                    >
                      {`$${range.min}`} - {`$${range.max}`}
                    </Checkbox>
                    <br />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4  "
            onClick={() => handleEdit(product)}
          >
            <Image
              src={
                product.data.productPictures &&
                product.data.productPictures.image0
                  ? product.data.productPictures.image0
                  : "/no_image.svg"
              }
              alt={product.data.name}
              className="w-full h-40 object-cover mb-4 rounded-lg "
              isBlurred
            />
            <h3 className="text-lg font-semibold mb-2">{product.data.name}</h3>
            <p className="text-gray-600 mb-2">
              Cantidad: {product.data.amount}
            </p>
            <p className="text-gray-600 mb-2">Color: {product.data.color}</p>
            <p className="text-gray-600 mb-2">
              Modificador: {product.data.modifier}
            </p>
            <p className="text-gray-600 mb-2">Precio: {product.data.price}</p>
            <p className="text-gray-600 mb-2">
              Precio público: {product.data.publicPrice}
            </p>
            <p className="text-gray-600 mb-2">
              Disponible para venta: {product.data.saleAvailable ? "Sí" : "No"}
            </p>
            <p className="text-gray-600 mb-2">Categoría: {product.data.type}</p>
            <p className="text-gray-600 mb-2">
              Sub-Categoria: {product.data.subCategory}
            </p>
            <p className="text-gray-600 mb-2">
              Descripción: {product.data.description}
            </p>
            <p className="text-gray-600 mb-2">
              Visible: {product.data.visible ? "Sí" : "No"}
            </p>
            <p className="text-gray-600 mb-2">Categoria: {product.data.type}</p>
            <p className="text-gray-600 mb-2">
              Periodo de Prueba: {product.data.trialPeriod}
            </p>

            {/* Agrega más detalles según sea necesario */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProductView;
