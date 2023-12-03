import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMenuDetail } from "../context/MenuContext";
import CategorySideBarItem from "./CategorySideBarItem";
import { STORAGE } from "@/utils/browserStorage";
import Button from "./library/Button";
import Input from "./library/Input";

export default function CategorySideBar({ selectedCategoryId, setSelectedCategoryId }) {
  const { categories, addCategory } = useMenuDetail();

  const [newCategory, setNewCategory] = useState({ name: "", order: categories.length + 1 });
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const router = useRouter();

  const addCategoryHandler = async (id) => {
    const { name, order } = newCategory;
    const response = await addCategory(id, name, order);
    setNewCategory({ name: "", order: categories.length + 1 });
    setIsCreateCategory(false);
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      router.push(`/menu/${router.query.menuId}/category/${response._id}`);
    }
  };

  const createCategoryButtonClickHandler = () => {
    if (!isCreateCategory) {
      setIsCreateCategory(true);
      return;
    }
    addCategoryHandler(router.query.menuId);
  };

  useEffect(() => {
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      setIsCreateCategory(true);
    }
  }, [router.isReady]);

  return (
    <div className="category-side-bar-container">
      <div className="categories-place">
        <h6>Kategoriler</h6>
        <div className="category-list">

          {categories.map((item) => (
            <div
              className={`list-item ${selectedCategoryId === item._id ? "active" : ""}`}
              onClick={() => setSelectedCategoryId(item._id)}
            >
              <p>
                <span>&#x25cf;</span>
                {" "}
                {item.name}
              </p>
            </div>
          ))}

        </div>
        <div className="add-category-button">
          {isCreateCategory && (
          <div className="new-category-place">
            <Input placeholder="İçecekler" onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
            <div className="actions">
              <i className="icon icon-checkmark" onClick={() => createCategoryButtonClickHandler()} />
              <i className="icon icon-cancel" onClick={() => setIsCreateCategory(false)} />
            </div>
          </div>
          )}
          {!isCreateCategory && (
          <Button
            onClick={() => setIsCreateCategory(true)}
            fluid
            variant="outlined"
          >
            Kategori Ekle
          </Button>
          )}
        </div>
      </div>
      <div className="add-campaing-button">
        <Button fluid>Kampnayalar</Button>
      </div>
    </div>
  );
}
