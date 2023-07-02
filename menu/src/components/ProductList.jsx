import React from "react";
import { useMenu } from "../context/Menu";
import ProductCard from "./ProductCard";
import { useBasket } from "../context/Basket";

export default function ProductList() {
  const { products } = useMenu();
  const { basketItems } = useBasket();

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
            key={product._id}
            count={basketItems !== undefined ? basketItems.products.find((basketItem) => basketItem._id === product._id)?.count : 0}
          />
        ))}
      </div>
    </div>
  );
}
