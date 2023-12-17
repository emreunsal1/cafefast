/* eslint-disable react/jsx-no-bind */
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,

} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { moveItemInArray } from "@/utils/common";
import { SortableItem } from "./SortableItem";
import ProductImageItem from "../ProductImageItem";

export function SortableProductImages({
  images, onSort, deleteImage, setPreviewIndex, setIsImagePreviewOpened,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      onSort(moveItemInArray(images, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={images}
        strategy={horizontalListSortingStrategy}
      >
        <div className="product-images-wrapper">
          {images.map((imageUrl, index) => (
            <SortableItem key={imageUrl} id={imageUrl}>
              <ProductImageItem
                image={imageUrl}
                openPreview={() => { setPreviewIndex(index); setIsImagePreviewOpened(true); }}
                onDeleteImage={() => deleteImage(imageUrl)}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
