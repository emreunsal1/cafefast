import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useImmer } from "use-immer";
import classNames from "classnames";
import Lightbox from "yet-another-react-lightbox";
import { AWS_CLOUDFRONT_URL, SAFE_IMAGE_TYPE } from "@/constants";
import PRODUCT_SERVICE from "@/services/product";
import { CDN_SERVICE } from "@/services/cdn";
import Input from "../../../components/library/Input";
import Checkbox from "../../../components/library/Checkbox";
import Icon from "@/components/library/Icon";
import Button from "@/components/library/Button";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/GlobalMessage";
import ProductImageItem from "@/components/ProductImageItem";
import { SortableProductImages } from "@/components/dnd/SortableProductImages";

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
  const { setLoading } = useLoading();
  const message = useMessage();
  const [isImagePreviewOpened, setIsImagePreviewOpened] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [product, setProduct] = useState({
    name: "", price: "", description: "", images: [],
  });
  const [attributes, setAttributes] = useImmer([]);
  const [attributeDetailData, setAttributeDetailData] = useImmer(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
  const [selectedAttributeDetailId, setSelectedAttributeDetailId] = useState(null);
  const [isNewAttributeAddActive, setIsNewAttributeAddActive] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const lastOption = attributeDetailData.options[attributeDetailData.options.length - 1];
  const isLastOptionValid = lastOption?.name.length > 0 && lastOption?.price > 0;
  const isWholeAttributeValid = isLastOptionValid;

  const renderAttributeDetail = Number.isInteger(selectedAttributeDetailId) || isNewAttributeAddActive;

  const allImagesOnlyUrls = product.images || [];

  const setProductData = (data) => {
    setProduct(data);
    setAttributes(() => data.attributes);
  };

  const getProductData = async () => {
    const response = await PRODUCT_SERVICE.getDetail(router.query.productId);
    setProductData(response);
  };

  const uploadProductImages = async (files) => {
    setLoading(true);
    const response = await CDN_SERVICE.uploadMultipleImages(files);
    setLoading(false);
    return response;
  };

  const updateOrCreateProduct = async () => {
    setLoading(true);
    const mockProduct = JSON.parse(JSON.stringify(product));
    mockProduct.price = Number(product.price);
    mockProduct.attributes = attributes;
    mockProduct.images = mockProduct.images.map((image) => image.split("/").pop());

    if (isUpdate) {
      const response = await PRODUCT_SERVICE.update(mockProduct);
      setProductData(response);
      setLoading(false);
      message.success("Ürün başarıyla güncellendi");
      return;
    }

    try {
      await PRODUCT_SERVICE.create(mockProduct);
      router.push("/product");
    } catch (err) {
      if (err.response.data.type === "VALIDATION_ERROR") {
        message.error("Lütfen alanları kurallara göre doldurunuz");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && router.query.productId !== "new") {
      setIsUpdate(true);
      getProductData();
    }
  }, [router.isReady]);

  const imageInputChangeHandler = async (e) => {
    const maxImageCanBeUploaded = 5 - allImagesOnlyUrls.length;
    const imagesToUpload = [...e.target.files].slice(0, maxImageCanBeUploaded);
    e.target.value = null;
    setLoading(true);
    const { data: fileNames } = await uploadProductImages(imagesToUpload);
    const productImagesWithoutCFUrls = product.images.map((image) => image.split("/").pop());
    if (isUpdate) {
      const response = await PRODUCT_SERVICE.update({ _id: product._id, images: productImagesWithoutCFUrls.concat(fileNames) });
      setProductData(response);
    }
    const filenamesWithCFUrls = fileNames.map((filename) => `${AWS_CLOUDFRONT_URL}/${filename}`);
    setProduct({ ...product, images: product.images.concat(filenamesWithCFUrls) });
    setLoading(false);
  };

  const deleteImage = async (imageName) => {
    const filteredImages = product.images.filter((item) => item !== imageName);
    setLoading(true);
    const productImagesWithoutCFUrls = filteredImages.map((image) => image.split("/").pop());
    const response = await PRODUCT_SERVICE.update({ _id: product._id, images: productImagesWithoutCFUrls });
    setLoading(false);
    setProductData(response);
  };

  const selectAttributeItem = (index) => {
    setSelectedAttributeDetailId(index);
    setAttributeDetailData(attributes[index]);
  };

  const openAttributeDetailAsNewAttribute = () => {
    setIsNewAttributeAddActive(true);
    setAttributeDetailData(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
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

  const openImageInput = () => {
    document.querySelector("#add-image-input").click();
  };

  const onSetImages = (newImages) => {
    setProduct({ ...product, images: newImages });
  };

  return (
    <div className="product-detail-page">
      {isUpdate ? <h3>Ürününü Düzenle</h3> : <h3>Yeni Ürün Oluştur</h3>}
      <div className="product-images">
        <div className="product-images-title">
          <h6>Ürün Fotografları</h6>
          <Button onClick={openImageInput} disabled={allImagesOnlyUrls.length === 5}>
            <span>Fotograf Ekle</span>
            <Icon name="plus" />
          </Button>
        </div>

        <div className="divider" />
        {!!product.images && (
        <SortableProductImages
          images={product.images}
          deleteImage={deleteImage}
          onSetImages={onSetImages}
          setIsImagePreviewOpened={setIsImagePreviewOpened}
          setPreviewIndex={setPreviewIndex}
        />
        )}
        <div className="product-images-wrapper">
          {/* {product.images?.map((image, index) => (
            <ProductImageItem
              image={image}
              openPreview={() => { setPreviewIndex(index); setIsImagePreviewOpened(true); }}
              onDeleteImage={() => deleteImage(image)}
            />
          ))}
          {imagesToUpload?.map((image, index) => (
            <ProductImageItem
              openPreview={() => { setPreviewIndex((product.images?.length || 0) + index); setIsImagePreviewOpened(true); }}
              image={URL.createObjectURL(image)}
            />
          ))} */}
        </div>
      </div>
      <div className="product-detail-inputs">
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
      </div>
      <div className="product-attributes">
        <div className="product-attributes-title">
          <h6>Ürün Özellikleri</h6>
          <p>Ürünü sepete eklerken Sos Seçimi, Baharat Seçimi, Promosyon Seçimi gibi alanları buradan girebilirsiniz</p>
        </div>
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
            {!renderAttributeDetail && <Button onClick={openAttributeDetailAsNewAttribute}>Ekle</Button>}
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
                <h6>Seçenekler</h6>
                <div className="attribute-options-header">
                  <div className="name-title">İsim</div>
                  <div className="price-title">Fiyat</div>
                </div>
                {attributeDetailData.options.map((option, index) => (
                  <div className="attribute-option" key={index}>
                    <div className="option-name">
                      <Input
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
                      <Input
                        type="number"
                        placeholder="50"
                        onChange={(e) => updateAttributeOptionData({
                          field: "price",
                          data: Number(e.target.value),
                          index,
                        })}
                        value={option.price}
                      />
                    </div>
                  </div>
                ))}
                {isLastOptionValid && (
                <div className="add-attribute-option-button">
                  <Button onClick={addAttributeOptionHandler}>Ekle</Button>
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
      <Button onClick={updateOrCreateProduct}>
        {isUpdate ? "Güncelle" : "Oluştur"}
      </Button>

      <input type="file" id="add-image-input" accept={SAFE_IMAGE_TYPE} multiple hidden onChange={imageInputChangeHandler} />
      {product.images?.length && (
        <Lightbox
          open={isImagePreviewOpened}
          index={previewIndex}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, .6)" } }}
          controller={{ closeOnBackdropClick: true }}
          close={() => { setIsImagePreviewOpened(false); }}
          slides={allImagesOnlyUrls.map((image) => ({ src: image }))}
        />
      )}
    </div>
  );
}
