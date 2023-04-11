import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProduct } from "../context/ProductContext";

const { Meta } = Card;

export default function ProductCard({ product, setIsEdit }) {
  const { deleteProduct } = useProduct();
  return (
    <div id="ProductCard">
      <Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        actions={[
          <EditOutlined onClick={() => setIsEdit(product._id)} key="edit" />,
          <DeleteOutlined key="delete" onClick={() => deleteProduct(product._id)} />,
        ]}
      >
        <Meta title={product.name} description={product.description} />
      </Card>
    </div>
  );
}
