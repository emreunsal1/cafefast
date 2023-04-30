import React, { useState } from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductModal, { PRODUCT_MODAL_ACTIONS } from "./ProductModal";
import PRODUCT_SERVICE from "../services/product";

const { Meta } = Card;

export const PRODUCT_CARD_ACTIONS = {
  UPDATE: "update",
  DELETE: "delete",
};

export default function ProductCard({ product, onAction }) {
  const [isEdit, setIsEdit] = useState(false);

  const editHandler = () => {
    setIsEdit(true);
  };

  const deleteHandler = () => {
    PRODUCT_SERVICE.deleteProduct();
    onAction({ action: PRODUCT_CARD_ACTIONS.DELETE, product });
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

  return (
    <div id="ProductCard">
      <Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
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
