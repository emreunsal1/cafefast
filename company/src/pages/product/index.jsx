import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useProduct } from "../../context/ProductContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../components/ProductCard";
import ProductModal, { PRODUCT_MODAL_ACTIONS } from "../../components/ProductModal";
import Layout from "../../components/Layout";
import { CDN_SERVICE } from "@/services/cdn";
import { API_URl, PRODUCT_ROUTE } from "@/constants";
import { STORAGE } from "@/utils/browserStorage";
import PRODUCT_SERVICE from "@/services/product";

export default function Product() {
  const {
    getProducts, products, updateProduct,
    deleteProduct,
    createProduct,
  } = useProduct();
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isMultipleEdit, setIsMultipleEdit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProducts();
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      setPopupVisible(true);
    }
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
    let uploadedImages = [];
    if (images.length) {
      const originalFiles = images.map((image) => image.originFileObj);
      const response = await CDN_SERVICE.uploadMultipleImages(originalFiles);
      uploadedImages = response.data;
    }
    createProduct({ ...data, images: uploadedImages });
    setPopupVisible(false);
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      router.push("/menu");
    }
  };

  const importInputChangeHandler = async (e) => {
    const excelFile = e.target.files[0];
    e.target.value = null;
    try {
      await CDN_SERVICE.uploadProductExcel(excelFile);
      getProducts();
    } catch (err) {
      console.log("error :>> ", err);
    }
  };

  const multipleDeleteProducts = async () => {
    await PRODUCT_SERVICE.multiDeleteProduct(selectedProducts);
    setIsMultipleEdit(false);
    setSelectedProducts([]);
    getProducts();
  };

  const selectedButtonClickHandler = () => {
    if (isMultipleEdit) {
      multipleDeleteProducts();
    }
    setIsMultipleEdit(true);
  };

  return (
    <div>
      <div className="export-import-products-button">
        <a href={`${API_URl}${PRODUCT_ROUTE}/export`} download>Ürünleri Dışarı Aktar</a>
        <div>
          <span>Excel ile içe aktar</span>
          <input type="file" onChange={importInputChangeHandler} />
        </div>
        <Button onClick={() => selectedButtonClickHandler()}>
          {!isMultipleEdit ? "Seç" : "Sil"}
        </Button>
      </div>
      <div className="product-card-wrapper">
        {products.map((product) => (
          <ProductCard
            setSelectedProducts={setSelectedProducts}
            selectedProducts={selectedProducts}
            isMultipleEdit={isMultipleEdit}
            key={product._id}
            onAction={productCardOnActionHandler}
            product={product}
          />
        ))}
        <div className="create-product-card">
          <Card onClick={() => router.push("/product")} style={{ width: 200 }}>
            <PlusCircleOutlined />
          </Card>
        </div>
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
