import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useBasket } from "@/context/Basket";

export default function BasketList() {
  const { basketItems } = useBasket();
  useEffect(() => {
    console.log("selam", basketItems.product);
  }, [basketItems]);

  return (
    <div>
      <div className="list-wrapper">
        <h1>Ürünler</h1>
        {basketItems.products.map((product) => (
          <ProductCard data={product} />
        ))}
        <h1>Kampanyalar</h1>
        {basketItems.campaigns.map((campaign) => (
          <ProductCard data={campaign} />
        ))}
      </div>
    </div>
  );
}
