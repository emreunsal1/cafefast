import React from "react";
import { useMenu } from "../context/Menu";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useMenu();

  return (
    <div id="productList">
      <div className="container">
        {products?.map((product) => (
          <ProductCard data={product} />
        ))}
      </div>
    </div>
  );
}
