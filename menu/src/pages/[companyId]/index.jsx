import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Layout from "@/components/Layout";
import CampainSlider from "@/components/CampainSlider";
import { useBasket } from "../../context/Basket";
import { useMenu } from "../../context/Menu";
import rollGif from "../../assets/rooll.gif";

export default function Index() {
  const [isFetchedData, setIsFetchedData] = useState(false);
  const { query, isReady } = useRouter();

  const { getMenu } = useMenu();
  const { getBasketItems } = useBasket();
  const fetchData = async () => {
    await getMenu(query.companyId);
    await getBasketItems({ companyId: query.companyId });
    setTimeout(() => {
      setIsFetchedData(true);
    }, 2000);
  };

  useEffect(() => {
    if (isReady) {
      fetchData();
    }
  }, [isReady]);

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
