import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useProduct } from "../../context/ProductContext";
import ProductCard from "../../components/ProductCard";
import ProductModal from "../../components/ProductModal";

export default function Product() {
  const { getProducts, products } = useProduct();
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (isEdit !== false) {
      setPopupVisible(true);
      const result = products.find((product) => product._id === isEdit);
      setSelectedProduct(result);
    }
  }, [isEdit]);

  useEffect(() => {
    if (popupVisible === false) {
      setIsEdit(false);
    }
  }, [popupVisible]);

  return (
    <div>
      <div className="product-card-wrapper">
        {products.map((product) => <ProductCard key={product._id} setIsEdit={setIsEdit} product={product} />)}
        <div className="create-product-card">
          <Card onClick={() => setPopupVisible(true)} style={{ width: 200 }}>
            <PlusCircleOutlined />
          </Card>
        </div>
        {popupVisible && (
        <div className="create-product-modal-wrapper">
          <ProductModal editedProduct={selectedProduct} setPopupVisible={setPopupVisible} isEdit={isEdit} />
        </div>
        )}
      </div>
    </div>
  );
}
