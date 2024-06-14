import { SearchIcon } from "@/app/components/icons/SearchIcon";
import { fetchCollection, fetchProducts } from "@/app/lib/firebase/firebase";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  Image,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ModalDetailsProduct from "../Components/ModalDetailsProduct";
import { useCart } from "@/app/lib/context/CartContext";

const ListProductPublicSalesView = ({ onEdit, onAdd, nameList }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { addToCart, cart } = useCart();
  const [alertMessage, setAlertMessage] = useState("");

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

  useEffect(() => {
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
  }, []);

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

  const handleFilterOptionChange = (optionType, optionValue) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [optionType]: prevFilters[optionType].includes(optionValue)
        ? prevFilters[optionType].filter((value) => value !== optionValue)
        : [...prevFilters[optionType], optionValue],
    }));
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
      saleAvailable,
      visible,
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
    // Agregar condición para verificar si el producto está en venta
    const isOnSale = saleAvailable === true;
    const isAvailable = visible === true;

    return (
      matchesSearchTerm &&
      matchesFilterOptions &&
      matchesPriceFilters &&
      isOnSale && // Agregar esta condición al retorno del filtro
      isAvailable // Agregar esta condición al retorno del filtro
    );
  });

  const showAlert = (message, delay) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, delay); // El mensaje desaparecerá después de 3 segundos
  };

  const handleAddToCart = (product) => {
    console.log("product", product);
    if (!product) return;

    const maxQuantity = product.data.amount; // Máximo de productos que se pueden agregar al carrito
    const cartItem = cart.find((item) => item.itemId === product.uid); // Buscar si el producto ya está en el carrito

    if (cartItem) {
      // Si el producto ya está en el carrito, verificar si se puede agregar más
      if (cartItem.quantity >= maxQuantity) {
        showAlert(
          "No puedes añadir más de este producto. Solo hay " +
            maxQuantity +
            " en stock. Y ya tienes " +
            cartItem.quantity +
            " en el carrito.",
          3000
        );
        return;
      }
    }

    if (product.data.amount <= 0) {
      showAlert("No hay suficiente stock para añadir este producto.", 1000);
      return;
    }

    addToCart(product.uid);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onOpenChange(false);
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">{nameList}</h2>
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
          placeholder="Buscar productos"
          startContent={
            <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Accordion className="mt-4">
          <AccordionItem
            key="1"
            title="Filtros"
            className="text-lg font-semibold"
            aria-label="Filtros"
            defaultOpened
          >
            <Accordion>
              <AccordionItem key="2" title="Color" aria-label="Color">
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
              </AccordionItem>
              <AccordionItem title="Subcategoría" aria-label="Subcategoría">
                {filterOptions.subCategories.map((subCategory) => (
                  <div key={subCategory}>
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
              </AccordionItem>
              <AccordionItem title="Precio" aria-label="Precio">
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
              </AccordionItem>
              <AccordionItem title="Categoría" aria-label="Categoria">
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
              </AccordionItem>
            </Accordion>
          </AccordionItem>
        </Accordion>
      </div>
      {/*<div className="w-3/4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <Card
              className="py-4"
              key={index}
              isPressable
              onPress={() => handleViewDetails(product)}
            >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  {product.data.type}
                </p>
                <small className="text-default-500">
                  ${product.data.publicPrice}
                </small>
                <h4 className="uppercase font-bold text-large">
                  {product.data.name}
                </h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2 flex justify-center items-center">
                <Image
                  alt={product.data.name}
                  className="object-contain relative w-full h-64"
                  src={
                    product.data.productPictures &&
                    product.data.productPictures.image0
                      ? product.data.productPictures.image0
                      : "/no_image.svg"
                  }
                  layout="fill"
                />
              </CardBody>
              <CardFooter className="flex justify-between items-center">
                <Button
                  auto
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>*/}
      {alertMessage && (
        <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
          {alertMessage}
        </div>
      )}
      <div className="w-3/4 p-4">
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card key={index} className="w-full">
              <CardBody>
                <div className="grid grid-cols-1 justify-items-center">
                  <Image
                    src={
                      product.data.productPictures &&
                      product.data.productPictures.image0
                        ? product.data.productPictures.image0
                        : "/no_image.svg"
                    }
                    width={200}
                    height={200}
                    alt="Product"
                  />
                  <p>{product.data.name}</p>
                  <p>${product.data.publicPrice}</p>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetails(product)}
                  >
                    Ver producto
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <ModalDetailsProduct
          product={selectedProduct}
          isOpen={isOpen}
          onClose={handleCloseModal}
          onAddCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default ListProductPublicSalesView;
