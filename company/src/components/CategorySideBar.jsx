import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMenuDetail } from "../context/MenuContext";
import { STORAGE } from "@/utils/browserStorage";
import Button from "./library/Button";
import Input from "./library/Input";
import Icon from "./library/Icon";

export default function CategorySideBar() {
  const {
    categories, addCategory, selectedCategory, setSelectedCategory,
  } = useMenuDetail();

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
      <div className="category-side-bar-container-title">
        <h6>Kategoriler</h6>
        <Button
          onClick={() => setIsCreateCategory(true)}
          variant="outlined"
        >
          Ekle +
        </Button>
      </div>
      {isCreateCategory && (
        <div className="add-category-button">
          <div className="new-category-place">
            <Input placeholder="İçecekler" onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
            <div className="actions">
              <Icon name="checkmark" onClick={() => createCategoryButtonClickHandler()} />
              <Icon name="cancel" onClick={() => setIsCreateCategory(false)} />
            </div>
          </div>
        </div>
      )}
      <div className="category-list">
        {categories.map((item) => (
          <div
            className={`category-list-item ${selectedCategory?._id === item._id ? "active" : ""}`}
            onClick={() => setSelectedCategory(item)}
          >
            {item.name}
            <Icon name="right-arrow" />
          </div>
        ))}
      </div>
      <div className="add-campaign-button">
        <Button fluid onClick={() => setSelectedCategory(null)}>Kampnayalar</Button>
      </div>
    </div>
  );
}
