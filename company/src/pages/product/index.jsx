import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
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
    <div className="products">
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
      <div className="product-list-wrapper">
        {products.map((product) => (
          <ProductCard
            isSelectable={isMultipleEdit}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            data={product}
          />
        ))}
        <div className="create-product-card">
          <Card onClick={() => router.push("/product/new")} style={{ width: 200 }}>
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
