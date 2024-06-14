import { fetchCollection } from "@/app/lib/firebase/firebase";
import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const CategorySelect = ({ categoryType, onSelect, selectedOption }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await fetchCollection("categories");
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Set the selected option when the selectedOption prop changes
    setSelectedCategory(selectedOption);
  }, [selectedOption]);

  const handleCategoryChange = (event) => {
    const selectedSubCategory = event.target.value;
    setSelectedCategory(selectedSubCategory);
    if (categoryType === "types") {
      onSelect({ name: "type", value: selectedSubCategory });
    } else if (categoryType === "colors") {
      onSelect({ name: "color", value: selectedSubCategory });
    } else if (categoryType === "subCategories") {
      onSelect({ name: "subCategory", value: selectedSubCategory });
    } // Enviar un objeto con clave-valor
  };

  return (
    <Select
      bordered
      value={selectedCategory}
      onChange={handleCategoryChange}
      aria-label={categoryType}
      placeholder={selectedCategory}
    >
      {categories.find((category) => category.uid === categoryType)?.data &&
        Object.entries(
          categories.find((category) => category.uid === categoryType).data
        ).map(([name, value]) => (
          <SelectItem
            key={value}
            value={value}
            name={name}
            aria-label={categoryType}
          >
            {value}
          </SelectItem>
        ))}
    </Select>
  );
};

export default CategorySelect;
