import React, { useState } from "react";
import { Input } from "antd";
import { useRouter } from "next/router";
import { useMenu } from "../context/MenuContext";

export default function CategorySideBar({ selectedCategory, setSelectedCategory }) {
  const { categories, addCategory } = useMenu();

  const [newCategory, setNewCategory] = useState({ name: "", order: categories.length + 1 });
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const router = useRouter();

  return (
    <div id="categorySideBar">
      <div className="side-container">
        <div className="list">
          {categories.map((category) => (
            <div className="item" onClick={() => setSelectedCategory(category.id)} key={category.id}>
              <div className="icon">icon</div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
        <div className="add-button" onClick={() => setIsCreateCategory(true)}> + </div>
        {isCreateCategory && (
        <div className="new-category">
          <Input
            placeholder="Category Name"
            onPressEnter={() => {
              addCategory(router.query.menuId, newCategory.name, newCategory.order);
              setIsCreateCategory(false);
            }}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
        </div>
        )}
      </div>

    </div>
  );
}
