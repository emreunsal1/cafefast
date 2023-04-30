import React from "react";
import { Card, Button } from "antd";

const { Meta } = Card;

export default function ProductCard({
  name,
  description,
  price,
  inStock,
  menuPrices,
}) {
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
          <Button type="primary">Sepete EKle</Button>
        </Card>
      </div>
    </div>
  );
}
