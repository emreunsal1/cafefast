import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useProduct } from "../../context/ProductContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../components/ProductCard";
import ProductModal, { PRODUCT_MODAL_ACTIONS } from "../../components/ProductModal";
import Layout from "../../components/Layout";
import { CDN_SERVICE } from "@/services/cdn";

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
    if (action === PRODUCT_CARD_ACTIONS.CREATE) {
      createProduct(data);
    }
    if (action === PRODUCT_CARD_ACTIONS.UPDATE) {
      updateProduct(data);
    }
    if (action === PRODUCT_CARD_ACTIONS.DELETE) {
      deleteProduct(data._id);
    }
  };

  const productModalActionHandler = async ({ data, images }) => {
    if (data === PRODUCT_MODAL_ACTIONS.CANCEL) {
      setPopupVisible(false);
      return;
    }
    const uploadedImages = [];
    if (images.length) {
      const promises = images.map((image) => CDN_SERVICE.uploadImage(image.originFileObj));
      const response = await Promise.all(promises);
      response.map((item) => uploadedImages.push(item.data.filePath));
    }
    createProduct({ ...data, images: uploadedImages });
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

Product.getLayout = function getLayout(product) {
  return (
    <Layout>
      {product}
    </Layout>
  );
};
