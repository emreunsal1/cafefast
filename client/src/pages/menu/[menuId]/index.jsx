import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Col, Empty, FloatButton, Row,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategorySideBar from "../../../components/CategorySideBar";
import { useMenu } from "../../../context/MenuContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../../components/ProductCard";

export default function MenuDetail() {
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const { categories, getMenu } = useMenu();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  const selectedCategory = categories?.find((category) => category._id === selectedCategoryId) || null;

  const redirectToProductAddPage = () => {
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
      <Row>
        <Col span={4}>
          <div className="side-bar">
            <CategorySideBar selectedCategoryId={selectedCategoryId} setSelectedCategoryId={setSelectedCategoryId} />
          </div>
        </Col>
        <Col span={18}>
          <div className="products">
            {!selectedCategory?.products.length && <Empty />}
            <Row>
              {selectedCategory?.products?.map((product) => (
                <Col span={8}>
                  <ProductCard onAction={productCardOnActionHandler} product={product} />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
      {selectedCategory && (
        <FloatButton
          icon={<PlusOutlined />}
          description="Add Products"
          onClick={redirectToProductAddPage}
        />
      )}
    </div>
  );
}
