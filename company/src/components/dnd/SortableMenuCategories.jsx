/* eslint-disable react/jsx-no-bind */
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import Icon from "../library/Icon";

export default function SortableMenuCategories({
  categories, onSort, selectedCategoryId, categoryItemClickHandler,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((_category) => _category._id === active.id);
      const newIndex = categories.findIndex((_category) => _category._id === over.id);
      onSort(arrayMove(categories, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories}
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
                <Icon name="right-arrow" />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
