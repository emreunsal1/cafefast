/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col, Empty, FloatButton, Row,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CategorySideBar from "../../../components/CategorySideBar";
import { MenuDetailContext, useMenuDetail } from "../../../context/MenuContext";
import ProductCard, { PRODUCT_CARD_ACTIONS } from "../../../components/ProductCard";
import CAMPAIGN_SERVICE from "@/services/campaign";

function MenuDetail() {
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const {
    categories, getMenu, campaings, removeCampaings,
  } = useMenuDetail();
  const [isAddCampaing, setIsAddCampaing] = useState(false);
  const [allCampaings, setAllCampaings] = useState([]);
  const router = useRouter();

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

  const getCampaings = async () => {
    const response = await CAMPAIGN_SERVICE.get();
    const { data } = response;

    if (campaings.length) {
      const notIncludesCampaings = campaings.map((item) => {
        const filteredData = data.filter((campaing) => campaing._id !== item._id);
        return filteredData;
      })[0];
      setAllCampaings(notIncludesCampaings);
      return;
    }
    setAllCampaings(data);
  };

  const addCampaingClickHandler = async (campain) => {
    const response = await CAMPAIGN_SERVICE.addCampaingToMenu(router.query.menuId, campain._id);
    if (response) {
      campaings.push(campain);
      const filterAllCampaings = allCampaings.filter((_campain) => _campain._id !== campain._id);
      setAllCampaings(filterAllCampaings);
    }
  };

  const removeClickHandler = async (campain) => {
    try {
      removeCampaings(router.query.menuId, campain);
      setAllCampaings([...allCampaings, campain]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (isAddCampaing) {
      getCampaings();
    }
  }, [isAddCampaing]);

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
            <Row gutter={16}>
              {campaings && campaings.map((campaing) => (
                <Col span={8} key={campaing._id}>
                  <Card
                    title={campaing.name}
                    extra={<div onClick={() => removeClickHandler(campaing)}>remove -</div>}
                  >
                    {campaing.description}
                  </Card>
                </Col>
              ))}
            </Row>
            <Button onClick={() => setIsAddCampaing(true)}>Add Campaign</Button>
          </div>
        </Col>
      </Row>
      {isAddCampaing && (
      <Row gutter={16}>
        { allCampaings.map((campain, index) => (
          <Col span={8} key={index}>
            <Card
              title={campain.name}
              extra={<div onClick={() => addCampaingClickHandler(campain)}>add +</div>}
            >
              {campain.description}
            </Card>
          </Col>
        ))}
      </Row>
      )}
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

export default function () {
  return <MenuDetailContext><MenuDetail /></MenuDetailContext>;
}
