/* eslint-disable react/button-has-type */
import React, { useState } from "react";
import { Card, Button } from "antd";
import { useRouter } from "next/router";
import BASKET_SERVICE from "../services/basket";
import { API_URl, ROUTES } from "../../constants";
import { createCloudfrontImageUrl } from "../../utils/images";
import { useBasket } from "@/context/Basket";

const { Meta } = Card;

export default function ProductCard({ data }) {
  const [quantity, setQuantity] = useState(data.count || 0);
  const { query } = useRouter();
  const { getBasketItems } = useBasket();

  const addBasketClickHandler = async () => {
    BASKET_SERVICE.addToBasket({ companyId: query.companyId, productId: data._id });
    setQuantity((prev) => prev + 1);
  };

  const updateQuantityHandler = async (type) => {
    if (type === "increase") {
      console.log({ id: data.id, quantity });
      await BASKET_SERVICE.updateItemQuantity({
        productId: data._id,
        companyId: query.companyId,
        quantity: quantity + 1,
      });
      setQuantity((prev) => prev + 1);
    }

    if (type === "decrease") {
      if (quantity === 1) {
        await BASKET_SERVICE.deleteProduct({ companyId: query.companyId, productId: data._id });
        await getBasketItems({ companyId: query.companyId });
      } else {
        await BASKET_SERVICE.updateItemQuantity({
          productId: data._id,
          companyId: query.companyId,
          quantity: quantity - 1,
        });
      }
      setQuantity((prev) => prev - 1);
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
          cover={<img alt="example" src={data.images[0]} />}
        >
          <Meta title={data.name} description={data.price} />
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
