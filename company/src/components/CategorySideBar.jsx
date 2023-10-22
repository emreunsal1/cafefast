import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { useRouter } from "next/router";
import { CloseCircleFilled } from "@ant-design/icons";
import { useMenuDetail } from "../context/MenuContext";
import CategorySideBarItem from "./CategorySideBarItem";
import { STORAGE } from "@/utils/browserStorage";

export default function CategorySideBar({ selectedCategoryId, setSelectedCategoryId }) {
  const { categories, addCategory } = useMenuDetail();

  const [newCategory, setNewCategory] = useState({ name: "", order: categories.length + 1 });
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const router = useRouter();

  const addCategoryButtonHandler = async (id, name, order) => {
    const response = await addCategory(id, name, order);
    setNewCategory({ name: "", order: categories.length + 1 });
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      router.push(`/menu/${router.query.menuId}/category/${response._id}`);
    }
  };

  useEffect(() => {
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      setIsCreateCategory(true);
    }
  }, [router.isReady]);

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
        { !isCreateCategory && <div className="add-button" onClick={() => setIsCreateCategory(true)}><Button>Add Category + </Button></div> }
        {isCreateCategory && (
          <>
            <div className="new-category">
              <Input
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <Button
              onClick={() => addCategoryButtonHandler(router.query.menuId, newCategory.name, newCategory.order)}
            >
              Ekle
            </Button>
            <Button shape="circle" onClick={() => setIsCreateCategory(false)} icon={<CloseCircleFilled />} />
          </>
        )}
      </div>

    </div>
  );
}
