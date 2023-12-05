import React, { useEffect, useState } from "react";
import { Col, Empty, Row } from "antd";
import { useRouter } from "next/router";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "./ProductCard";
import { CATEGORY_SERVICE } from "@/services/menu";
import { useProduct } from "@/context/ProductContext";
import { useMenuDetail } from "@/context/MenuContext";
import ProductsTable from "./ProductsTable";

export default function MenuDetailBody({ selectedCategory }) {
  const { updateProduct } = useProduct();
  const { getMenu } = useMenuDetail();
  const router = useRouter();
  const productCardOnActionHandler = async ({ action, data }) => {
    if (action === PRODUCT_CARD_ACTIONS.UPDATE) {
      updateProduct(data);
    }
    if (action === PRODUCT_CARD_ACTIONS.DELETE) {
      await CATEGORY_SERVICE.removeProduct(router.query.menuId, selectedCategory._id, data._id);
      getMenu(router.query.menuId);
    }
  };

  return (
    <div className="products">
      {!selectedCategory && <Empty />}
      <Row>
        <ProductsTable selectedCategory={selectedCategory} data={selectedCategory?.products} />
      </Row>
    </div>
  );
}
