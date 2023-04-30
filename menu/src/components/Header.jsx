import React, { useEffect } from "react";
import { useMenu } from "../context/Menu";

export default function Header() {
  const {
    categories,
    getProductsWithCategory,
  } = useMenu();

  const categoryClickHandler = (categoryId) => {
    getProductsWithCategory(categoryId);
  };
  return (
    <div id="Header">
      <div className="container" style={{ display: "flex" }}>
        { categories?.map((category) => (
          <div
            key={category._id}
            onClick={() => categoryClickHandler(category._id)}
            className="item"
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
