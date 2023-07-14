import React from "react";
import { useMenu } from "../context/Menu";
import ProductCard from "./ProductCard";
import { useBasket } from "../context/Basket";

export default function ProductList() {
  const { products } = useMenu();
  const { productCounts } = useBasket();

  return (
    <div id="productList">
      <div className="container">
        {products?.map((product) => (
          <ProductCard
            id={product._id}
            price={product.price}
            name={product.name}
            description={product.description}
            inStock={product.inStock}
            menuPrices={product.menuPrices}
            key={product._id}
            count={productCounts[product._id]}
          />
        ))}
      </div>
    </div>
  );
}
