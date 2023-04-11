import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProduct } from "../context/ProductContext";

export default function AddProductModal({ setPopupVisible, isEdit, editedProduct }) {
  const [product, setProduct] = useState({ name: "", price: "", description: "" });
  const { createProduct, updateProduct } = useProduct();

  const submitClickHandler = async () => {
    const newProduct = { ...product, price: Number(product.price) };
    setProduct(newProduct);
    if (isEdit !== false) {
      setProduct({ ...newProduct, _id: editedProduct._id });
      updateProduct(newProduct);
      setPopupVisible(false);
      return;
    }
    setPopupVisible(false);
    createProduct(newProduct);
  };

  const selectImageHandler = (e) => {
    console.log(e);
  };

  useEffect(() => {
    if (isEdit) {
      setProduct(editedProduct);
    }
  }, []);

  return (
    <div>
      <Modal
        title="Basic Modal"
        open
        footer={[
          <Button key="selam" onClick={submitClickHandler}>Submit</Button>,
          <Button key="denem" onClick={() => setPopupVisible(false)}>Cancel</Button>,
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
