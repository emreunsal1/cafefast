import React from "react";
import { useMenu } from "../context/Menu";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useMenu();

  return (
    <div id="productList">
      <div className="container">
        { products?.map((product) => (
          <ProductCard
            id={product._id}
            price={product.price}
            name={product.name}
            description={product.description}
            inStock={product.inStock}
            menuPrices={product.menuPrices}
          />
        ))}
      </div>
    </div>
  );
}
