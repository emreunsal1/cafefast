import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useProduct } from "../../context/ProductContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../components/ProductCard";
import ProductModal, { PRODUCT_MODAL_ACTIONS } from "../../components/ProductModal";

export default function Product() {
  const {
    getProducts, products, updateProduct,
    deleteProduct,
    createProduct,
  } = useProduct();
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const productCardOnActionHandler = ({ action, data }) => {
    if (action === PRODUCT_CARD_ACTIONS.UPDATE) {
      updateProduct(data);
    }
    if (action === PRODUCT_CARD_ACTIONS.DELETE) {
      deleteProduct(data._id);
    }
  };

  const productModalActionHandler = ({ data }) => {
    createProduct(data);
    setPopupVisible(false);
  };

  return (
    <div>
      <div className="product-card-wrapper">
        {products.map((product) => <ProductCard key={product._id} onAction={productCardOnActionHandler} product={product} />)}
        <div className="create-product-card">
          <Card onClick={() => setPopupVisible(true)} style={{ width: 200 }}>
            <PlusCircleOutlined />
          </Card>
        </div>
        {popupVisible && <ProductModal onAction={productModalActionHandler} action={PRODUCT_MODAL_ACTIONS.CREATE} />}
      </div>
    </div>
  );
}