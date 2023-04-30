import React, { useEffect } from "react";
import { useMenu } from "../context/Menu";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";

export default function Index() {
  const { getMenu } = useMenu();
  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="product-list">
        <ProductList />
      </div>
    </div>
  );
}
