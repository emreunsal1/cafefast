import React, { createContext, useContext, useState } from "react";

const Context = createContext({});

export function BasketContext({ children }) {
  const [basketItems, setBasketItems] = useState([]);

  const addBasketItem = (productId) => {};

  return (
    <Context.Provider value={{

    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useBasket = () => useContext(Context);
