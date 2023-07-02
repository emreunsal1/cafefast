import React, { createContext, useContext, useState } from "react";
import BASKET_SERVICE from "@/services/basket";

const Context = createContext({});

export function BasketContext({ children }) {
  const [basketItems, setBasketItems] = useState([]);

  const getBasketItems = async ({ companyId }) => {
    const response = await BASKET_SERVICE.getBasket({ companyId });
    const { data } = response;
    setBasketItems(data);
    return data;
  };

  const addBasketItem = async (productId) => {
    await BASKET_SERVICE.addToBasket({ companyId: "64208d2c890cdcf8376c87a5", productId });
  };

  return (
    <Context.Provider value={{
      getBasketItems,
      addBasketItem,
      basketItems,
      setBasketItems,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useBasket = () => useContext(Context);
