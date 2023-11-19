import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Form,
  Upload,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useImmer } from "use-immer";
import classNames from "classnames";
import { SAFE_IMAGE_TYPE } from "@/constants";
import PRODUCT_SERVICE from "@/services/product";
import { CDN_SERVICE } from "@/services/cdn";
import Input from "../../../components/library/Input";
import Checkbox from "../../../components/library/Checkbox";

const DEFAULT_PRODUCT_ATTRIBUTE_OPTION_DATA = {
  name: "",
  price: 0,
};
const DEFAULT_PRODUCT_ATTRIBUTE_DATA = {
  title: "",
  description: "",
  type: "single",
  required: false,
  options: [DEFAULT_PRODUCT_ATTRIBUTE_OPTION_DATA],
};

export default function ProductDetail() {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "", price: "", description: "", images: [],
  });
  const [attributes, setAttributes] = useImmer([]);
  const [attributeDetailData, setAttributeDetailData] = useImmer(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
  const [selectedAttributeDetailId, setSelectedAttributeDetailId] = useState(null);
  const [isNewAttributeAddActive, setIsNewAttributeAddActive] = useState(false);
  const images = useRef([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const lastOption = attributeDetailData.options[attributeDetailData.options.length - 1];
  const isLastOptionValid = lastOption?.name.length > 0 && lastOption?.price > 0;
  const isWholeAttributeValid = isLastOptionValid;

  const renderAttributeDetail = Number.isInteger(selectedAttributeDetailId) || isNewAttributeAddActive;

  const setProductData = (data) => {
    setProduct(data);
    // eslint-disable-next-line no-unused-vars
    setAttributes(() => data.attributes);
  };

  const getProductData = async () => {
    images.current = [];
    const response = await PRODUCT_SERVICE.getDetail(router.query.productId);
    setProductData(response);
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
    const mockProduct = JSON.parse(JSON.stringify(product));
    mockProduct.price = Number(product.price);
    mockProduct.attributes = attributes;
    if (isUpdate) {
      mockProduct.images = product.images.map((image) => new URL(image).pathname.slice(1));
      images.current.forEach((item) => {
        mockProduct.images.push(item);
      });
      const response = await PRODUCT_SERVICE.update(mockProduct);
      setProductData(response);
      return;
    }
    mockProduct.images = images.current;
    await PRODUCT_SERVICE.create(mockProduct);
    router.push("/product");
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

  const selectAttributeItem = (index) => {
    setSelectedAttributeDetailId(index);
    // eslint-disable-next-line no-unused-vars
    setAttributeDetailData(() => attributes[index]);
  };

  const openAttributeDetail = (id = null) => {
    if (id == null) {
      setIsNewAttributeAddActive(true);
      setAttributeDetailData(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
    }
  };

  const attributeDetailFieldChangeHandler = (field, data) => {
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData[field] = data; });
  };

  const addAttributeOptionHandler = () => {
    if (!lastOption || !isLastOptionValid) {
      return;
    }

    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData.options.push(DEFAULT_PRODUCT_ATTRIBUTE_OPTION_DATA); });
  };

  const updateAttributeOptionData = ({ index, field, data }) => {
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData.options[index][field] = data; });
  };

  const saveAttributeHandler = () => {
    if (isNewAttributeAddActive) {
      setAttributes((_attributes) => { _attributes.push(attributeDetailData); });
      setIsNewAttributeAddActive(false);
      return;
    }

    setAttributes((_attributes) => { _attributes[selectedAttributeDetailId] = attributeDetailData; });
    // eslint-disable-next-line no-unused-vars
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData = DEFAULT_PRODUCT_ATTRIBUTE_DATA; });
    setSelectedAttributeDetailId(null);
  };

  return (
    <div className="product-detail-page">
      <Form onFinish={submitFormHandler}>
        {isUpdate && (
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
        <Input
          placeholder="name"
          label="Ürün İsmi"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <Input
          type="number"
          label="Fiyat Bilgisi"
          value={product.price}
          placeholder="50 TL"
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <Input
          label="Ürün Açıklaması"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />
        <div className="product-attributes">
          <h2>Ekstra Özellikler</h2>
          <div className="product-attributes-body">
            <div className="attribute-list">
              {
                attributes.map((attribute, index) => (
                  <div
                    className={classNames({
                      "attribute-list-item": true,
                      selected: index === selectedAttributeDetailId,
                    })}
                    onClick={() => selectAttributeItem(index)}
                  >
                    {attribute.title}
                  </div>
                ))
              }
              {!renderAttributeDetail && <Button shape="circle" onClick={() => openAttributeDetail(null)} icon={<PlusOutlined />} />}
            </div>
            {renderAttributeDetail && (
            <div className="attribute-detail">
              <div className="attribute-field">
                <div className="attribute-field-value">
                  <Input
                    type="text"
                    placeholder="Sos Seçimi"
                    label="Özellik İsmi"
                    value={attributeDetailData.title}
                    onChange={(e) => attributeDetailFieldChangeHandler("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="attribute-field">
                <div className="attribute-field-value">
                  <Input
                    type="text"
                    label="Özellik Açıklaması"
                    value={attributeDetailData.description}
                    onChange={(e) => attributeDetailFieldChangeHandler("description", e.target.value)}
                  />
                </div>
              </div>
              <div className="attribute-field">
                <div className="attribute-field-value">
                  <Checkbox
                    type="checkbox"
                    label="Çoklu Seçim"
                    description="Eklediğiniz özelliğin seçeneklerini birden çok seçilebilir yapmak için işaretleyin."
                    value={attributeDetailData.type === "multi"}
                    onChange={(e) => attributeDetailFieldChangeHandler("type", e.target.checked ? "multi" : "single")}
                  />
                </div>
              </div>
              <div className="attribute-field">
                <Checkbox
                  type="checkbox"
                  label="Zorunlu Seçim"
                  description="Eklediğiniz özelliğin en az bir tane seçilmesini istiyorsanız işaretleyin"
                  value={attributeDetailData.required}
                  onChange={(e) => attributeDetailFieldChangeHandler("required", e.target.checked)}
                />
              </div>
              <div className="attribute-options">
                <h3>Seçenekler</h3>
                <div className="attribute-options-header">
                  <div className="name-title">İsim</div>
                  <div className="price-title">Fiyat</div>
                </div>
                {attributeDetailData.options.map((option, index) => (
                  <div className="attribute-option" key={index}>
                    <div className="option-name">
                      <input
                        type="text"
                        onChange={(e) => updateAttributeOptionData({
                          field: "name",
                          data: e.target.value,
                          index,
                        })}
                        placeholder="Acı Sos"
                        value={option.name}
                      />

                    </div>
                    <div className="option-price">
                      <input
                        type="number"
                        placeholder="50"
                        onChange={(e) => updateAttributeOptionData({
                          field: "price",
                          data: Number(e.target.value),
                          index,
                        })}
                        value={option.price}
                      />
                      TL
                    </div>
                  </div>
                ))}
                {isLastOptionValid && (
                <div className="add-attribute-option-button">
                  <Button onClick={addAttributeOptionHandler} shape="circle" icon={<PlusOutlined />} />
                </div>
                )}
              </div>
              <div className="attribute-actions">
                <div className="save-attribute-button">
                  <Button onClick={saveAttributeHandler} disabled={!isWholeAttributeValid}>Özelliği Kaydet</Button>
                </div>
              </div>
            </div>
            )}
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
