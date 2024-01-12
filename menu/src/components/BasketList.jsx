import React from "react";
import ProductCard from "./ProductCard";
import { useBasket } from "@/context/Basket";

export default function BasketList() {
  const { basketItems } = useBasket();

  return (
    <div>
      <div className="list-wrapper">
        <h1>Ürünler</h1>
        <h1>Kampanyalar</h1>
        {basketItems.campaigns.map((campaign) => (
          <ProductCard data={campaign} />
        ))}
      </div>
    </div>
  );
}
