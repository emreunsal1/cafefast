/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col, Empty, FloatButton, Row,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategorySideBar from "../../../components/CategorySideBar";
import { useMenu } from "../../../context/MenuContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../../components/ProductCard";

export default function MenuDetail() {
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const { menu, categories, getMenu } = useMenu();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  const selectedCategory = categories?.find((category) => category._id === selectedCategoryId) || null;

  const redirectToProductAddPage = () => {
    router.push(`/menus/${router.query.menuId}/category/${selectedCategory._id}`);
  };

  const redirectToCampaignPage = (campaignId) => {
    let url = `/menus/${router.query.menuId}/campaign`;
    if (campaignId) {
      url += `/${campaignId}`;
    }
    router.push(url);
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
      <h2>Categories</h2>
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
      <h2>Campaigns</h2>
      <Row>
        <Col span={10}>
          <div className="side-bar">
            <ul>
              {menu?.campaigns.map((campaign) => (
                <li
                  onClick={() => router.push(`/menus/${menu._id}/campaign/${campaign._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {campaign.name}
                </li>
              ))}
            </ul>
            <Button onClick={() => redirectToCampaignPage()}>Add Campaign</Button>
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
