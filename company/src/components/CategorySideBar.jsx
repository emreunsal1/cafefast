import React, { useState } from "react";
import { Button, Input } from "antd";
import { useRouter } from "next/router";
import { useMenuDetail } from "../context/MenuContext";
import CategorySideBarItem from "./CategorySideBarItem";

export default function CategorySideBar({ selectedCategoryId, setSelectedCategoryId }) {
  const { categories, addCategory } = useMenuDetail();

  const [newCategory, setNewCategory] = useState({ name: "", order: categories.length + 1 });
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const router = useRouter();

  return (
    <div id="categorySideBar">
      <div className="side-container">
        <div className="list">
          {categories.map((category) => (
            <CategorySideBarItem
              key={category._id}
              data={category}
              selectedCategoryId={selectedCategoryId}
              onClick={() => setSelectedCategoryId(category._id)}
            />
          ))}
        </div>
        <div className="add-button" onClick={() => setIsCreateCategory(true)}><Button>Add Category + </Button></div>
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
