import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Checkbox from "./library/Checkbox";
import { useProduct } from "@/context/ProductContext";
import Icon from "./library/Icon";

export default function ProductCard({
  data, isSelectable, selectedProducts, setSelectedProducts,
}) {
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    setIsSelected(selectedProducts.includes(data._id));
  }, [selectedProducts]);

  const router = useRouter();
  const {
    deleteProduct,
  } = useProduct();

  const checkboxOnchangeHandler = (e) => {
    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, data._id]);
      return;
    }
    const filteredSelectedProducts = selectedProducts.filter((item) => item !== data._id);
    setSelectedProducts(filteredSelectedProducts);
  };
  return (
    <div className="product-card">
      <div className="product-card-container">
        {isSelectable && (
        <div className="selectable">
          <Checkbox onChange={(e) => checkboxOnchangeHandler(e)} value={isSelected} />
        </div>
        )}
        <div className="content" onClick={() => router.push(`/product/${data._id}`)}>
          <div className="image-wrapper">
            <img src={data.images[0]} alt="" />
          </div>
          <div className="info">
            <div className="name">
              {data.name}
            </div>
            <div className="price">
              FİYAT:
              <span>{data.priceAsText}</span>
            </div>
            <div className="description">
              {data.description}
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="item edit" onClick={() => router.push(`/product/${data._id}`)}>
            <Icon name="edit-outlined" />
          </div>
          <div className="item delete" onClick={() => deleteProduct(data._id)}>
            <Icon name="delete-outlined" />
          </div>
        </div>
      </div>
    </div>
  );
}
