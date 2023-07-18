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
        {basketData.map((product) => (
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
