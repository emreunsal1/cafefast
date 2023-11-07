import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Upload,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { SAFE_IMAGE_TYPE } from "@/constants";
import PRODUCT_SERVICE from "@/services/product";
import { CDN_SERVICE } from "@/services/cdn";

export default function ProductDetail() {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "", price: "", description: "", images: [],
  });
  const [attriburtes, setAttriburtes] = useState([]);
  const images = useRef([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const getProductData = async () => {
    images.current = [];
    const response = await PRODUCT_SERVICE.getDetail(router.query.productId);
    setProduct(response);
  };

  const uploadProductImages = async () => {
    if (images.current.length) {
      const response = await CDN_SERVICE.uploadMultipleImages(images.current);
      images.current = response.data;
      return response;
    }
  };

  const submitFormHandler = async () => {
    await uploadProductImages();
    const mockProduct = product;
    mockProduct.price = Number(product.price);
    if (isUpdate) {
      mockProduct.images = product.images.map((image) => new URL(image).pathname.slice(1));
      images.current.forEach((item) => {
        mockProduct.images.push(item);
      });
      await PRODUCT_SERVICE.update(mockProduct);
      getProductData();
      return;
    }
    mockProduct.images = images.current;
    await PRODUCT_SERVICE.create(mockProduct);
    getProductData();
  };

  useEffect(() => {
    if (router.query.productId) {
      setIsUpdate(true);
      getProductData();
    }
  }, [router.isReady]);

  const selectImageHandler = async (e) => {
    const { fileList } = e;
    images.current = fileList.map((item) => item.originFileObj);
  };

  const deleteImage = (id) => {
    const newData = product.images.filter((item) => item !== id);
    setProduct({ ...product, images: newData });
  };

  return (
    <div>
      <Form onFinish={submitFormHandler}>
        { isUpdate && (
        <div className="image-list" style={{ display: "flex" }}>
          {product && product.images.map((item, index) => (
            <div className="item" key={index}>
              <Image src={item} width={200} />
              <Button onClick={() => deleteImage(item)} danger>Sil</Button>
            </div>
          ))}
        </div>
        )}
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload
            accept={SAFE_IMAGE_TYPE}
            onChange={selectImageHandler}
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
        <div className="attr-place">
          <div>Ekstra Özellikler </div>
          <Button shape="circle" icon={<PlusOutlined />} />
          <div className="attrTable">
            <div className="name-list" />
            <div className="info">
              <div className="row">
                name:
                <input placeholder="attr-name" />
              </div>
              <div className="row">
                çoklu seçim:
                <input type="checkbox" />
              </div>
              <div className="row">
                zorulunlumu:
                <input type="checkbox" />
              </div>
              <div className="options-table">
                <div className="row">
                  <input placeholder="isim" />
                  <input placeholder="fiyat" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item>
          <Button htmlType="submit">
            {isUpdate ? "Güncelle" : "Oluştur"}
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
}
