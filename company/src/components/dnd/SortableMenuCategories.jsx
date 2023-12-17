/* eslint-disable react/jsx-no-bind */
import React, { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { moveItemInArray } from "@/utils/common";
import { useMenuDetail } from "@/context/MenuDetailContext";
import { useRouter } from "next/router";
import { SortableItem } from "./SortableItem";
import Icon from "../library/Icon";

export default function SortableMenuCategories() {
  const router = useRouter();
  const {
    sortMenuCategoriesWithIds, setSelectedCategoryId, selectedCategoryId, menu,
  } = useMenuDetail();

  const { categories } = menu;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
  );

  const categoryItemClickHandler = (item) => {
    router.push(`/menu/${router.query.menuId}/?categoryId=${item._id}`);
    setSelectedCategoryId(item._id);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((_category) => _category._id === active.id);
      const newIndex = categories.findIndex((_category) => _category._id === over.id);
      const newCategories = moveItemInArray(categories, oldIndex, newIndex);

      sortMenuCategoriesWithIds(newCategories);
    }
  }
  const itemIds = useMemo(() => categories.map((item) => item._id), [categories]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="category-list">
          {categories.map((category) => (
            <SortableItem key={category._id} id={category._id}>
              <div
                className={`category-list-item ${selectedCategoryId === category._id ? "active" : ""}`}
                onClick={() => categoryItemClickHandler(category)}
              >
                {category.name}
                <Icon name="right-chevron" />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
