/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useProduct } from "../../context/ProductContext";
import { PRODUCT_CARD_ACTIONS } from "../../components/ProductCard";
import ProductCard from "../../components/ProdcutCard";
import { PRODUCT_MODAL_ACTIONS } from "../../components/ProductModal";
import Layout from "../../components/Layout";
import { CDN_SERVICE } from "@/services/cdn";
import { API_URl, PRODUCT_ROUTE } from "@/constants";
import { STORAGE } from "@/utils/browserStorage";
import PRODUCT_SERVICE from "@/services/product";
import Button from "@/components/library/Button";

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
    if (STORAGE.getLocal("isCompleteMenuBoard") === "false") {
      setPopupVisible(true);
    }
  }, []);

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

  const exportProductsButtonClickHandler = () => {
    window.open(`${API_URl}${PRODUCT_ROUTE}/export`, "_blank");
  };

  const importProductsButtonClickHandler = () => {
    document.querySelector("#import-products").click();
  };

  return (
    <div className="products-page">
      <div className="products-page-header">
        <h3>Ürünlerim</h3>
        <div className="products-page-header-actions">
          <Button variant="outlined" onClick={exportProductsButtonClickHandler}>Ürünleri Dışa Aktar</Button>
          <Button variant="outlined" onClick={importProductsButtonClickHandler}>Excel ile içe aktar</Button>
          <Button onClick={() => selectedButtonClickHandler()}>
            {!isMultipleEdit ? "Seç" : "Sil"}
          </Button>
          <Button onClick={() => router.push("/product/new")} style={{ width: 200 }}>
            Yeni Ürün Ekle
          </Button>
        </div>
      </div>
      <div className="product-list-wrapper">
        {products.map((product) => (
          <ProductCard
            isSelectable={isMultipleEdit}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            data={product}
          />
        ))}
      </div>
      <input id="import-products" type="file" onChange={importInputChangeHandler} hidden />
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
