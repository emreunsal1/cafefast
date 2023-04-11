import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useProduct } from "../../context/ProductContext";
import ProductCard from "../../components/ProductCard";
import AddProductModal from "../../components/ProductModal";

export default function Product() {
  const { getProducts, products } = useProduct();
  const [popupVisible, setPopupVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <div className="product-card-wrapper">
        {products.map((product) => <ProductCard product={product} />)}
        <div className="create-product-card">
          <Card onClick={() => popupVisible(true)} style={{ width: 200 }}>
            <PlusCircleOutlined />
          </Card>
        </div>
        {popupVisible && (
        <div className="create-product-modal-wrapper">
          <AddProductModal setPopupVisible={setPopupVisible} isEdit={isEdit} />
        </div>
        )}
      </div>
    </div>
  );
}
