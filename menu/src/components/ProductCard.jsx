/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import { Card, Button } from "antd";
import BASKET_SERVICE from "@/services/basket";

const { Meta } = Card;

export default function ProductCard({
  id,
  name,
  description,
  price,
  inStock,
  menuPrices,
}) {
  const [quantity, setQuantity] = useState(0);
  const addToBasketHandler = async () => {
    await BASKET_SERVICE.addToBasket({ productId: id, companyId: "64208d2c890cdcf8376c87a5" });
    setQuantity(1);
    const basketResponse = await BASKET_SERVICE.getBasket({ companyId: "64208d2c890cdcf8376c87a5" });
    console.log("response.data :>> ", basketResponse.data);
  };

  const updateQuantityHandler = async (type) => {
    const newQuantity = type === "increase" ? quantity + 1 : quantity - 1;
    await BASKET_SERVICE.updateItemQuantity({
      companyId: "64208d2c890cdcf8376c87a5",
      productId: id,
      quantity: newQuantity,
    });
    setQuantity(newQuantity);
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
          {quantity === 0 && <Button type="primary" onClick={addToBasketHandler}>Sepete EKle</Button>}
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
