import React, { createContext, useContext, useState } from "react";
import BASKET_SERVICE from "@/services/basket";

const Context = createContext({});

export function BasketContext({ children }) {
  const [basketItems, setBasketItems] = useState(null);

  const productCounts = basketItems?.products.reduce((prev, curr) => {
    prev[curr._id] = curr.count;
    return prev;
  }, {}) || {};

  const getBasketItems = async ({ companyId }) => {
    const response = await BASKET_SERVICE.getBasket({ companyId });
    const { data } = response;
    setBasketItems(data);
    return data;
  };

  return (
    <Context.Provider value={{
      getBasketItems,
      basketItems,
      productCounts,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useBasket = () => useContext(Context);
