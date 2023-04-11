import React, { createContext, useContext, useState } from "react";
import PRODUCT_SERVICE from "../services/product";

const Context = createContext({});

export function ProductContext({ children }) {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    console.log("abc products", response);
    setProducts(response);
    return response;
  };

  const createProduct = async (data) => {
    const response = await PRODUCT_SERVICE.create(data);
    setProducts([...products, response.data]);
    return response.data;
  };
  return (
    <Context.Provider value={{
      products,
      setProducts,
      getProducts,
      createProduct,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProduct = () => useContext(Context);
