import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import { useEffect, useRef, useState } from "react";
import PRODUCT_SERVICE from "@/services/product";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/GlobalMessage";
import { useImmer } from "use-immer";
import { formatPrice } from "@/utils/common";

import { mapZodErrorObject, productSaveValidator } from "@/utils/validations";
import { ZodError } from "zod";
import Button from "./library/Button";
import Icon from "./library/Icon";
import Input from "./library/Input";

registerAllModules();

const mapProductForUpdate = (products) => products.map((product) => ({
  _id: product._id,
  name: product.name,
  description: product.description,
  price: formatPrice(product.price),
  inStock: product.inStock,
}));

const BULK_PRODUCTS_ADD_NEW_PRODUCT_DEFAULT_DATA = {
  name: "",
  description: "",
  price: 0,
};

export default function BulkProductsTable() {
  const hotRef = useRef();
  const changedIndexes = useRef(new Set());
  const initialValues = useRef("{}");
  const isNewProductInputsChangedBefore = useRef(false);

  const [products, setProducts] = useImmer([]);
  const [newProductData, setNewProductData] = useImmer(BULK_PRODUCTS_ADD_NEW_PRODUCT_DEFAULT_DATA);
  const { setLoading } = useLoading();
  const message = useMessage();
  const [isUndoAvailable, setIsUndoAvailable] = useState(false);
  const [newProductValidationErrors, setNewProductValidationErrors] = useState({});

  const addProductButtonDisabled = Object.keys(newProductValidationErrors).length > 0;

  const fetchProducts = async () => {
    setLoading(true);
    const _products = await PRODUCT_SERVICE.get();
    initialValues.current = JSON.stringify(_products);
    setProducts(_products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveClickHandler = async () => {
    const _changedIndexes = Array.from(changedIndexes.current);
    const newData = hotRef.current.hotInstance.getSourceData();
    const productsToUpdate = newData.filter((_, index) => _changedIndexes.includes(index));
    const mappedData = mapProductForUpdate(productsToUpdate);
    setLoading(true);
    try {
      await PRODUCT_SERVICE.bulkUpdate(mappedData);
      changedIndexes.current = new Set();
      setIsUndoAvailable(false);
    } catch (err) {
      message.error("Ürünleri güncellerken bir hata oluştu lütfen sayfayı yenileyip tekrar deneyiniz.");
    }
    setLoading(false);
    await fetchProducts();
  };

  const descriptionValidator = (value, callback) => {
    const isValid = !!value?.length;
    if (!isValid) {
      message.error("Açıklama alanı boş bırakılamaz");
    }
    callback(isValid);
  };

  const priceValidator = (value, callback) => {
    const floatRegex = /^\d+(\.\d+)?$/;
    const isValid = floatRegex.test(value);

    if (!isValid) {
      message.error("Fiyat bilgisi sadece sayısal değer alabilir. (Örn: \"15.99\")");
    }
    callback(isValid);
  };

  const undoButtonHandler = () => {
    hotRef.current.hotInstance.undo();
  };

  const newProductChangeHandler = (field, value) => {
    isNewProductInputsChangedBefore.current = true;
    setNewProductData((_newProductData) => { _newProductData[field] = value; });
  };

  const validateProduct = () => {
    try {
      productSaveValidator.parse(newProductData);
      setNewProductValidationErrors({});
    } catch (err) {
      if (err instanceof ZodError) {
        setNewProductValidationErrors(mapZodErrorObject(err));
      }
    }
  };

  const createProduct = async () => {
    setLoading(true);
    isNewProductInputsChangedBefore.current = false;
    try {
      await PRODUCT_SERVICE.create(newProductData);
      setNewProductValidationErrors({});
      setNewProductData(BULK_PRODUCTS_ADD_NEW_PRODUCT_DEFAULT_DATA);
      fetchProducts();
    // eslint-disable-next-line no-empty
    } catch {
      setLoading(false);
    }
  };

  const inputEnterHandler = () => {
    if (addProductButtonDisabled) {
      message.error("Ürün eklemek için alanları geçerli şekilde doldurmalısınız!");
      return;
    }
    createProduct();
  };

  const inputOnClickHandler = () => {
    isNewProductInputsChangedBefore.current = false;
    validateProduct();
  };

  useEffect(() => {
    if (isNewProductInputsChangedBefore.current) {
      validateProduct();
    }
  }, [newProductData]);

  return (
    <div className="bulk-products-table">
      <div className="bulk-products-table-new-product">
        <div className="new-product-title">
          <h6>Hızlı Ürün Ekle</h6>
        </div>
        <div className="new-product-inputs">
          <Input
            label="Ürün İsmi"
            onChange={(e) => newProductChangeHandler("name", e.target.value)}
            value={newProductData.name}
            error={newProductValidationErrors.name}
            onEnterKeyPress={inputEnterHandler}
            onClick={inputOnClickHandler}
          />
          <Input
            label="Ürün Açıklaması"
            onChange={(e) => newProductChangeHandler("description", e.target.value)}
            value={newProductData.description}
            error={newProductValidationErrors.description}
            onEnterKeyPress={inputEnterHandler}
            onClick={inputOnClickHandler}
          />
          <Input
            label="Fiyat"
            onChange={(e) => newProductChangeHandler("price", Number(e.target.value))}
            value={newProductData.price}
            error={newProductValidationErrors.price}
            type="number"
            onEnterKeyPress={inputEnterHandler}
            onClick={inputOnClickHandler}
          />
          <Button disabled={addProductButtonDisabled} onClick={createProduct}>
            Ekle
            <Icon name="plus" />
          </Button>
        </div>
      </div>

      <div className="divider" />
      <div className="bulk-products-table-title">
        <h3>Toplu Ürün Düzenleme</h3>
        <div className="bulk-products-table-actions">
          <Button onClick={saveClickHandler} disabled={!isUndoAvailable}>Kaydet</Button>
          <Button onClick={undoButtonHandler} disabled={!isUndoAvailable} variant="outlined">Geri Al</Button>
        </div>
      </div>
      <div className="excel-wrapper">
        <HotTable
          ref={hotRef}
          data={products}
          autoWrapRow
          stretchH="all"
          selectionMode="single"
          allowInsertRow
          allowInvalid={false}
          columns={[
            {
              title: "Ürün İsmi",
              data: "name",
              width: "400px",
              wordWrap: false,
            },
            {
              title: "Ürün Açıklaması",
              width: "300px",
              data: "description",
              validator: descriptionValidator,
              allowHtml: true,
              wordWrap: false,
            },
            {
              title: "Ürün Fiyatı",
              width: "100px",
              data: "price",
              type: "numeric",
              validator: priceValidator,
              wordWrap: false,
            },
            {
              title: "Stok Durumu",
              type: "checkbox",
              data: "inStock",
              width: "100px",
              className: "htCenter",
            },
          ]}
          afterChange={(changes) => {
            if (changes) {
              changes?.forEach((change) => {
                // eslint-disable-next-line no-unused-vars, prefer-const
                let [index, field, _oldValue, newValue] = change;
                const _isUndoAvailable = hotRef.current.hotInstance.isUndoAvailable();
                if (_isUndoAvailable) {
                  changedIndexes.current.add(index);
                } else {
                  changedIndexes.current = new Set();
                }
                setProducts((_product) => { _product[index][field] = newValue; });
                setIsUndoAvailable(_isUndoAvailable);
              });
            }
          }}
          rowHeaders
          colHeaders
          height="100%"
          licenseKey="non-commercial-and-evaluation"
        />
      </div>
    </div>
  );
}
