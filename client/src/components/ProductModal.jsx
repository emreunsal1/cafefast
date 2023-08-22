import React, { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const PRODUCT_MODAL_ACTIONS = {
  UPDATE: "update",
  CREATE: "create",
  CANCEL: "cancel",
};

export default function ProductModal({ data, onAction, action }) {
  const [product, setProduct] = useState(data || { name: "", price: "", description: "" });

  const submitClickHandler = async () => {
    const newProduct = { ...product, price: Number(product.price), images: ["https://http.cat/102"] };
    setProduct(newProduct);
    if (action === PRODUCT_MODAL_ACTIONS.UPDATE) {
      onAction({ action: PRODUCT_MODAL_ACTIONS.UPDATE, data: newProduct });
      return;
    }
    onAction({ action: PRODUCT_MODAL_ACTIONS.CREATE, data: newProduct });
  };

  const selectImageHandler = (e) => {
    console.log(e);
  };

  return (
    <div>
      <Modal
        title="Basic Modal"
        open
        footer={[
          <Button key="selam" onClick={submitClickHandler}>Submit</Button>,
          <Button key="denem" onClick={() => onAction({ data: PRODUCT_MODAL_ACTIONS.CANCEL })}>Cancel</Button>,
        ]}
      >
        <Form>
          <Form.Item>
            <Input placeholder="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Input type="number" value={product.price} placeholder="price" onChange={(e) => setProduct({ ...product, price: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Input placeholder="desc" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </Form.Item>
          <Form.Item label="Upload" valuePropName="fileList">
            <Upload onChange={(e) => selectImageHandler(e)} listType="picture-card">
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
