import React, { useState, useRef } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Upload,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GlobalMessageContext } from "@/context/GlobalMessage";
import { SAFE_IMAGE_TYPE } from "@/constants";

export default function ProductDetail({ data }) {
  const [product, setProduct] = useState(data || { name: "", price: "", description: "" });
  const images = useRef([]);

  const submitClickHandler = async () => {
    const newProduct = { ...product, price: Number(product.price) };
    setProduct(newProduct);
  };

  const selectImageHandler = async (e) => {
    const { fileList } = e;
    console.log("fileList", fileList);
    images.current = fileList;
  };
  return (
    <div>
      <Form>
        {data && (
        <div className="image-list">
          {data.images.map((item) => (
            <div className="item">
              <Image src={item} width={200} />
              <Button danger>Sil</Button>
            </div>
          ))}
        </div>
        )}
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload
            accept={SAFE_IMAGE_TYPE}
            onChange={(e) => selectImageHandler(e)}
            listType="picture-card"
          >
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
        <Form.Item>
          <Input placeholder="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
        </Form.Item>
        <Form.Item>
          <Input type="number" value={product.price} placeholder="price" onChange={(e) => setProduct({ ...product, price: e.target.value })} />
        </Form.Item>
        <Form.Item>
          <Input placeholder="desc" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        </Form.Item>
      </Form>
    </div>
  );
}
