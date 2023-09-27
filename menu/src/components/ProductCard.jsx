/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { useRouter } from "next/router";
import BASKET_SERVICE from "../services/basket";
import { useBasket } from "@/context/Basket";

const { Meta } = Card;

export default function ProductCard({ data }) {
  const { query } = useRouter();
  const { getBasketItems, basketItems } = useBasket();
  const [quantity, setQuantity] = useState(data.count || 0);

  const addBasketClickHandler = async () => {
    BASKET_SERVICE.addProductToBasket({ companyId: query.companyId, productId: data._id });
    setQuantity((prev) => prev + 1);
  };

  const updateQuantityHandler = async (type) => {
    if (type === "increase") {
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

  useEffect(() => {
    if (!data.count) {
      const itemInBasket = basketItems.products.find((_product) => _product._id === data._id);
      if (itemInBasket) {
        setQuantity(itemInBasket.count);
      }
    }
  }, [data]);

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
          <Meta title={data.name} description={data.priceAsText} />
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
