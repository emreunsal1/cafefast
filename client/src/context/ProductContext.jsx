import React, { createContext, useContext, useState } from "react";
import PRODUCT_SERVICE from "../services/product";

const Context = createContext({});

export function ProductContext({ children }) {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    setProducts(response);
    return response;
  };

  const createProduct = async (data) => {
    const response = await PRODUCT_SERVICE.create(data);
    console.log("response", response);
    setProducts([...products, response.data]);
    return response.data;
  };

  const updateProduct = async (data) => {
    const response = await PRODUCT_SERVICE.update(data);
    const filteredProducts = products.filter((product) => product._id !== data._id);
    filteredProducts.push(response);
    setProducts(filteredProducts);
  };

  const deleteProduct = async (id) => {
    await PRODUCT_SERVICE.deleteProduct(id);
    const filteredProducts = products.filter((product) => product._id !== id);
    setProducts(filteredProducts);
  };
  return (
    <Context.Provider value={{
      products,
      setProducts,
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProduct = () => useContext(Context);
