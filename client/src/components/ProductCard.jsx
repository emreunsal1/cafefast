import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function ProductCard({ product }) {
  return (
    <div id="ProductCard">
      <Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        actions={[
          <EditOutlined key="edit" />,
          <DeleteOutlined key="delete" />,
        ]}
      >
        <Meta title={product.name} description={product.description} />
      </Card>
    </div>
  );
}
