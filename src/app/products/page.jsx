"use client";
import React from "react";
import ListProductPublicSalesView from "./Views/ListProductPublicSalesView";

function Products() {
  return (
    <div className="relative bg-white shadow-md overflow-auto min-h-screen p-2 rounded-3xl mt-2">
      <div className=" bg-white ">
        <ListProductPublicSalesView nameList="Productos" />
      </div>
    </div>
  );
}

export default Products;
