import React from "react";
import { useMenu } from "../context/Menu";

export default function Header() {
  const {
    categories,
    setSelectedCategory,
  } = useMenu();
  return (
    <div id="Header">
      <div className="container" style={{ display: "flex" }}>
        { categories?.map((category) => (
          <div
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className="item"
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
