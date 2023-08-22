import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Layout from "@/components/Layout";
import { useBasket } from "../context/Basket";
import { useMenu } from "../context/Menu";
import rollGif from "../assets/rooll.gif";
import CampainSlider from "@/components/CampainSlider";

export default function Index() {
  const [isFetchedData, setIsFetchedData] = useState(false);

  const { getMenu } = useMenu();
  const { getBasketItems } = useBasket();
  useEffect(() => {
    const fetchData = async () => {
      await getMenu("64208d2c890cdcf8376c87a5");
      await getBasketItems({ companyId: "64208d2c890cdcf8376c87a5" });
      setTimeout(() => {
        setIsFetchedData(true);
      }, 2000);
    };
    fetchData();
  }, []);

  return (
    <div>
      {isFetchedData && (
      <>
        <div className="header">
          <Header />
        </div>
        <div className="campain-wrapper">
          <CampainSlider />
        </div>
        <div className="product-list">
          <ProductList />
        </div>
      </>
      )}
      {!isFetchedData && <Image src={rollGif} alt="" />}
    </div>
  );
}

Index.getLayout = function getLayout(index) {
  return (
    <Layout>
      {index}
    </Layout>
  );
};
