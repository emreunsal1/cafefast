import React from "react";
import Icon from "./library/Icon";

export default function ProductImageItem({ image, onDeleteImage, openPreview }) {
  return (
    <div className="product-image-item" onClick={() => openPreview(true)}>
      <div className="product-image-item-image-wrapper">
        <img src={image} />
      </div>
      <div
        className="product-image-item-delete-icon"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteImage(image);
        }}
      >
        <Icon name="delete-outlined" />
      </div>
      <div className="product-image-item-preview-icon">
        <Icon name="edit-outlined" />
      </div>
    </div>
  );
}
