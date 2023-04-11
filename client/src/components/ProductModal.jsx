import React, { useRef, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useProduct } from "../context/ProductContext";

export default function AddProductModal({ setPopupVisible, isEdit }) {
  const formRef = useRef();
  const [first, setfirst] = useState(second);
  const { createProduct } = useProduct();

  const submitClickHandler = async (formValue) => {
    formValue.price = Number(formValue.price);
    createProduct(formValue);
    setPopupVisible(false);
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
          <Button key="selam" onClick={() => formRef.current.submit()}>Submit</Button>,
          <Button key="denem">Cancel</Button>,
        ]}
      >
        <Form ref={formRef} onFinish={submitClickHandler}>
          <Form.Item name="name">
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item name="price">
            <Input type="number" placeholder="price" />
          </Form.Item>
          <Form.Item name="description">
            <Input placeholder="desc" />
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
