/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import BASKET_SERVICE from "../services/basket";
import { useBasket } from "../context/Basket";

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
  const { addBasketItem } = useBasket();
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    if (count !== undefined) {
      setQuantity(count);
    }
  }, []);

  const addBasketClickHandler = async () => {
    await addBasketItem(id);
    setQuantity((prev) => prev + 1);
  };

  const updateQuantityHandler = async (type) => {
    let newQuantity = quantity;
    if (type === "decrease" && quantity > 0) {
      setQuantity((prev) => prev - 1);
      newQuantity -= 1;
    } else {
      setQuantity((prev) => prev + 1);
      newQuantity += 1;
    }

    if (newQuantity === 0) {
      await BASKET_SERVICE.deleteProduct({ companyId: "64208d2c890cdcf8376c87a5", productId: id });
      return;
    }
    await BASKET_SERVICE.updateItemQuantity({
      productId: id,
      companyId: "64208d2c890cdcf8376c87a5",
      quantity: newQuantity,
    });
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
