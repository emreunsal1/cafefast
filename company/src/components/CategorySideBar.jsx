import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import classNames from "classnames";

import { useLoading } from "@/context/LoadingContext";
import { useClickOutSide } from "@/hooks";
import { STORAGE } from "@/utils/browserStorage";
import { useMenuDetail } from "@/context/MenuDetailContext";

import Button from "./library/Button";
import Input from "./library/Input";
import Icon from "./library/Icon";
import SortableMenuCategories from "./dnd/SortableMenuCategories";

export default function CategorySideBar() {
  const {
    menu, addCategory, setSelectedCategoryId,
  } = useMenuDetail();
  const searchParams = useSearchParams();

  const [newCategory, setNewCategory] = useState({ name: "", order: menu.categories.length + 1 });
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const router = useRouter();
  const addCategoryButtonRef = useRef();
  const { setLoading } = useLoading();

  const addCategoryHandler = async (id) => {
    const { name, order } = newCategory;
    setLoading(true);
    const response = await addCategory(id, name, order);
    setLoading(false);
    setIsCreateCategory(false);
    setNewCategory({ name: "", order: menu.categories.length + 1 });
    if (!STORAGE.getLocal("isCompleteMenuBoard")) {
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
    if (!STORAGE.getLocal("isCompleteMenuBoard")) {
      setIsCreateCategory(true);
    }
    if (searchParams.get("categoryId")) {
      setSelectedCategoryId(searchParams.get("categoryId"));
    }
  }, [router.isReady]);

  useClickOutSide(addCategoryButtonRef, () => setIsCreateCategory(false));

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
      <div
        ref={addCategoryButtonRef}
        className={classNames("add-category-button", {
          active: isCreateCategory,
        })}
      >
        <div className="new-category-place">
          <Input placeholder="İçecekler" onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <div className="actions">
            <Icon name="checkmark" onClick={() => createCategoryButtonClickHandler()} />
            <Icon name="cancel" onClick={() => setIsCreateCategory(false)} />
          </div>
        </div>
      </div>
      <SortableMenuCategories />
      <div className="add-campaign-button">
        <Button fluid onClick={() => setSelectedCategoryId(null)}>Kampnayalar</Button>
      </div>
    </div>
  );
}
