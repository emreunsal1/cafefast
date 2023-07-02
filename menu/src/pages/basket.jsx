import React, { useEffect } from "react";
import BASKET_SERVICE from "@/services/basket";

export default function Basket() {
  const getBasketItems = async () => {
    await BASKET_SERVICE.getBasket({ companyId: "64208d2c890cdcf8376c87a5" });
  };
  useEffect(() => {
    getBasketItems();
  }, []);

  return (
    <div>basket</div>
  );
}
