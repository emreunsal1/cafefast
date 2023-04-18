import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategorySideBar from "../../../components/CategorySideBar";
import { useMenu } from "../../../context/MenuContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../../components/ProductCard";

export default function MenuDetail() {
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const { menu, getMenu } = useMenu();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  const selectedCategory = menu?.categories?.find((category) => category._id === selectedCategoryId) || null;

  const redirectToProductAddPage = () => {
    console.log("selectedCategory :>> ", selectedCategory);
    router.push(`/menu/${router.query.menuId}/category/${selectedCategory._id}`);
  };

  const productCardOnActionHandler = ({ action, data }) => {
    if (action === PRODUCT_CARD_ACTIONS.UPDATE) {
      // Update product data
    }
    if (action === PRODUCT_CARD_ACTIONS.DELETE) {
      // Delete product data
    }
  };

  return (
    <div>
      <div className="side-bar">
        <CategorySideBar selectedCategoryId={selectedCategoryId} setSelectedCategoryId={setSelectedCategoryId} />
      </div>
      {selectedCategory && (
      <FloatButton
        icon={<PlusOutlined />}
        description="Add Products"
        onClick={redirectToProductAddPage}
      />
      )}
      <div className="products">
        {selectedCategory?.products?.map((product) => <ProductCard onAction={productCardOnActionHandler} product={product} />)}
      </div>
    </div>
  );
}
