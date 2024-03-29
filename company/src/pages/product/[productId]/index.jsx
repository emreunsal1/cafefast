import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useImmer } from "use-immer";
import classNames from "classnames";
import Lightbox from "yet-another-react-lightbox";
import { AWS_CLOUDFRONT_URL, SAFE_IMAGE_TYPE } from "@/constants";
import PRODUCT_SERVICE from "@/services/product";
import { CDN_SERVICE } from "@/services/cdn";
import Input from "@/components/library/Input";
import Checkbox from "@/components/library/Checkbox";
import Icon from "@/components/library/Icon";
import Button from "@/components/library/Button";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/GlobalMessage";
import { SortableProductImages } from "@/components/dnd/SortableProductImages";
import { mapZodErrorObject, productAttributeValidator, productSaveValidator } from "@/utils/validations";
import { ZodError } from "zod";

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
  const [validationErrors, setValidationErrors] = useState({});
  const [attributeValidationErrors, setAttributeValidationErrors] = useState({});

  const [product, setProduct] = useState({
    name: "", price: "", description: "", images: [],
  });
  const [attributes, setAttributes] = useImmer([]);
  const [attributeDetailData, setAttributeDetailData] = useImmer(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
  const [selectedAttributeDetailId, setSelectedAttributeDetailId] = useState(null);
  const [isNewAttributeAddActive, setIsNewAttributeAddActive] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const renderAttributeDetail = Number.isInteger(selectedAttributeDetailId) || isNewAttributeAddActive;

  const allImagesOnlyUrls = product.images || [];

  const setProductData = (data) => {
    setProduct(data);
    setAttributes(() => data.attributes);
  };

  const getProductData = async () => {
    setLoading(true);
    const response = await PRODUCT_SERVICE.getDetail(router.query.productId);
    setLoading(false);
    setProductData(response);
  };

  const uploadProductImages = async (files) => {
    setLoading(true);
    const response = await CDN_SERVICE.uploadMultipleImages(files);
    setLoading(false);
    return response;
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

  const updateOrCreateProduct = async () => {
    setLoading(true);
    const mockProduct = JSON.parse(JSON.stringify(product));
    mockProduct.price = Number(product.price);
    mockProduct.attributes = attributes;

    if (isUpdate) {
      delete mockProduct.images;
      const response = await PRODUCT_SERVICE.update(mockProduct);
      setProductData(response);
      setLoading(false);
      message.success("Ürün başarıyla güncellendi");
      return;
    }

    mockProduct.images = mockProduct.images.map((image) => image.split("/").pop());
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

  const deleteAttributeItem = (e, index) => {
    e.stopPropagation();
    setSelectedAttributeDetailId(null);
    if (selectedAttributeDetailId === index) {
      setAttributeDetailData(null);
    }
    setAttributes(() => attributes.filter((_, _index) => _index !== index));
  };

  const openAttributeDetailAsNewAttribute = () => {
    setIsNewAttributeAddActive(true);
    setAttributeDetailData(DEFAULT_PRODUCT_ATTRIBUTE_DATA);
  };

  const attributeDetailFieldChangeHandler = (field, data) => {
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData[field] = data; });
  };

  const addAttributeOptionHandler = () => {
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData.options.push(DEFAULT_PRODUCT_ATTRIBUTE_OPTION_DATA); });
  };

  const updateAttributeOptionData = ({ index, field, data }) => {
    setAttributeDetailData((_attributeDetailData) => { _attributeDetailData.options[index][field] = data; });
  };

  const openImageInput = () => {
    document.querySelector("#add-image-input").click();
  };

  const changeImageSort = async (newImages) => {
    const productImagesWithoutCFUrls = newImages.map((image) => image.split("/").pop());
    setProduct({ ...product, images: newImages });
    await PRODUCT_SERVICE.update({ _id: product._id, images: productImagesWithoutCFUrls });
  };

  const validateProduct = () => {
    try {
      productSaveValidator.parse(product);
      setValidationErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        setValidationErrors(mapZodErrorObject(err));
      }
    }
  };

  const validateProductAttributes = () => {
    try {
      const a = productAttributeValidator.parse(attributeDetailData);
      setAttributeValidationErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        setAttributeValidationErrors(mapZodErrorObject(err));
      }
    }
  };

  useEffect(() => {
    validateProduct();
  }, [product]);

  useEffect(() => {
    validateProductAttributes();
  }, [attributeDetailData]);

  const hasAttributeValidationErrors = renderAttributeDetail && Object.keys(attributeValidationErrors).length > 0;
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const isSaveButtonDisabled = renderAttributeDetail || hasAttributeValidationErrors || hasValidationErrors;

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
          onSort={changeImageSort}
          setIsImagePreviewOpened={setIsImagePreviewOpened}
          setPreviewIndex={setPreviewIndex}
        />
        )}
      </div>
      <div className="product-detail-inputs">
        <Input
          placeholder="name"
          label="Ürün İsmi"
          error={validationErrors.name}
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <Input
          type="number"
          label="Fiyat Bilgisi"
          value={product.price}
          error={validationErrors.price}
          placeholder="50 TL"
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
        />
        <Input
          label="Ürün Açıklaması"
          value={product.description}
          error={validationErrors.description}
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
                    key={index}
                    className={classNames({
                      "attribute-list-item": true,
                      selected: index === selectedAttributeDetailId,
                    })}
                    onClick={() => selectAttributeItem(index)}
                  >
                    <span>{attribute.title}</span>
                    <Icon name="delete-outlined" onClick={(e) => deleteAttributeItem(e, index)} />
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
                    error={attributeValidationErrors.title}
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
                    error={attributeValidationErrors.description}
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
                    <div className="option-index">
                      {index + 1}
                      .
                    </div>
                    <div className="option-name">
                      <Input
                        type="text"
                        error={!option.name.length && attributeValidationErrors.options}
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
                        error={!option.name.length && !!attributeValidationErrors.options}
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
                {!hasAttributeValidationErrors && (
                  <div className="add-attribute-option-button">
                    <Button onClick={addAttributeOptionHandler}><Icon name="plus" /></Button>
                  </div>
                )}
              </div>
              <div className="attribute-actions">
                <div className="save-attribute-button">
                  <Button onClick={saveAttributeHandler} disabled={hasAttributeValidationErrors}>Özelliği Kaydet</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Button disabled={isSaveButtonDisabled} onClick={updateOrCreateProduct}>
        {isUpdate ? "Güncelle" : "Oluştur"}
      </Button>

      <input type="file" id="add-image-input" accept={SAFE_IMAGE_TYPE} multiple hidden onChange={imageInputChangeHandler} />
      {product.images?.length > 0 && (
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
