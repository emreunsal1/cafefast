import React, { useState } from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import ProductModal, { PRODUCT_MODAL_ACTIONS } from "./ProductModal";

const { Meta } = Card;

export const PRODUCT_CARD_ACTIONS = {
  UPDATE: "update",
  DELETE: "delete",
  CANCEL: "cancel",
};

export default function ProductCard({
  isMultipleEdit, product, onAction, selectedProducts, setSelectedProducts,
}) {
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();

  const editHandler = () => {
    router.push(`/product/${product._id}`);
  };

  const deleteHandler = () => {
    onAction({ action: PRODUCT_CARD_ACTIONS.DELETE, data: product });
  };

  const modalActionHandler = ({ action, data }) => {
    if (action === PRODUCT_MODAL_ACTIONS.UPDATE) {
      onAction({ action: PRODUCT_CARD_ACTIONS.UPDATE, data });
    }

    if (action === PRODUCT_MODAL_ACTIONS.CANCEL) {
      // Cancel Action kullanırsak diye
    }
    setIsEdit(false);
  };

  const checkboxOnchangeHandler = (e) => {
    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, product._id]);
      return;
    }
    const filteredSelectedProducts = selectedProducts.filter((item) => item !== product._id);
    setSelectedProducts(filteredSelectedProducts);
  };

  return (
    <div id="ProductCard">
      {isMultipleEdit && (
      <input
        type="checkbox"
        onChange={(e) => checkboxOnchangeHandler(e)}
      />
      )}
      <Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src={product.images[0]} />}
        actions={[
          <EditOutlined onClick={editHandler} key="edit" />,
          <DeleteOutlined key="delete" onClick={deleteHandler} />,
        ]}
      >
        <Meta title={product.name} description={product.description} />
      </Card>
      {isEdit && (
        <div className="create-product-modal-wrapper">
          <ProductModal data={product} onAction={modalActionHandler} action={PRODUCT_MODAL_ACTIONS.UPDATE} />
        </div>
      )}
    </div>
  );
}
