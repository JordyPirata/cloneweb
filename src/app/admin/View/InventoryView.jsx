import React, { useState } from "react";
import AddProductForm from "./InventoryViewComponents/AddProductForm";
import ListProductView from "./InventoryViewComponents/ListProductView";
import { fetchProducts } from "@/app/lib/firebase/firebase";
import EditProductForm from "./InventoryViewComponents/EditProductForm";
import AddTypesForm from "./InventoryViewComponents/AddTypesForm";
import TypesView from "./InventoryViewComponents/TypesView";

function InventoryView(onSales) {
  const [productsView, setProductsView] = useState("list");
  const [product, setProduct] = useState([]);

  const handleEdit = (e) => {
    setProductsView("edit");
    setProduct(e);
  };

  return (
    <div className="static m-2">
      {productsView === "list" && (
        <ListProductView
          onSales={onSales}
          onEdit={handleEdit}
          onAdd={(e) => setProductsView(e)}
        />
      )}
      {productsView === "addProduct" && (
        <AddProductForm onBack={() => setProductsView("list")} />
      )}
      {productsView === "edit" && (
        <EditProductForm
          product={product}
          onBack={() => setProductsView("list")}
        />
      )}
      {productsView === "categories" && (
        <TypesView onBack={() => setProductsView("list")} />
      )}
    </div>
  );
}

export default InventoryView;
