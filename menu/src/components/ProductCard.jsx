import React from "react";
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
  const addToBasketHandler = async () => {
    await BASKET_SERVICE.addToBasket({ productId: id, companyId: "64208d2c890cdcf8376c87a5" });
    const basketResponse = await BASKET_SERVICE.getBasket({ companyId: "64208d2c890cdcf8376c87a5" });
    console.log("response.data :>> ", basketResponse.data);
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
          <Button type="primary" onClick={addToBasketHandler}>Sepete EKle</Button>
        </Card>
      </div>
    </div>
  );
}
