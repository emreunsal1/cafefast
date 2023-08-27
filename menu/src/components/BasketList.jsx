import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function BasketList({ data }) {
  const [basketData, setBasketData] = useState(data);
  useEffect(() => {
    if (data.length) {
      setBasketData(data);
    }
  }, [data]);

  return (
    <div>
      <div className="list-wrapper">
        <h1>Ürünler</h1>
        {basketData.products.map((product) => (
          <ProductCard
            id={product._id}
            count={product.count}
            name={product.name}
            price={product.price}
            key={product._id}
            image={product.images[0]}
          />
        ))}
        <h1>Kampanyalar</h1>
        {basketData.campaigns.map((product) => (
          <ProductCard
            id={product._id}
            count={product.count}
            name={product.name}
            price={product.price}
            key={product._id}
          />
        ))}
      </div>
    </div>
  );
}
