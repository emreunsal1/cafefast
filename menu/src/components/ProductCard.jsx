/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import { Card, Button } from "antd";
import BASKET_SERVICE from "../services/basket";

const { Meta } = Card;

export default function ProductCard({
  id,
  name,
  description,
  price,
  inStock,
  menuPrices,
  count,
}) {
  const [quantity, setQuantity] = useState(count || 0);

  const addBasketClickHandler = async () => {
    BASKET_SERVICE.addToBasket({ companyId: "64208d2c890cdcf8376c87a5", productId: id });
    setQuantity((prev) => prev + 1);
  };

  const updateQuantityHandler = async (type) => {
    if (type === "decrease") {
      if (quantity === 1) {
        await BASKET_SERVICE.deleteProduct({ companyId: "64208d2c890cdcf8376c87a5", productId: id });
      } else {
        await BASKET_SERVICE.updateItemQuantity({
          productId: id,
          companyId: "64208d2c890cdcf8376c87a5",
          quantity: quantity - 1,
        });
      }
      setQuantity((prev) => prev - 1);
    }
    if (type === "increase") {
      await BASKET_SERVICE.updateItemQuantity({
        productId: id,
        companyId: "64208d2c890cdcf8376c87a5",
        quantity: quantity + 1,
      });
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div id="productCard">
      <div className="cardContainer">
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
          <Meta title={name} description={price} />
          {quantity === 0 && <Button type="primary" onClick={() => addBasketClickHandler()}>Sepete EKle</Button>}
          {quantity > 0 && (
          <>
            <button onClick={() => updateQuantityHandler("decrease")}>-</button>
            {quantity}
            <button onClick={() => updateQuantityHandler("increase")}>+</button>
          </>
          )}
        </Card>
      </div>
    </div>
  );
}
