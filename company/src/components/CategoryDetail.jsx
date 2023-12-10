import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";
import PRODUCT_SERVICE from "@/services/product";
import { CATEGORY_SERVICE } from "@/services/menu";
import { STORAGE } from "@/utils/browserStorage";
import { useMenuDetail } from "@/context/MenuContext";
import Button from "./library/Button";
import Icon from "./library/Icon";
import Input from "./library/Input";
import { CDN_SERVICE } from "@/services/cdn";

export default function CategoryDetail() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const { selectedCategoryId } = useMenuDetail();
  const [categoryName, setCategoryName] = useState(null);

  const {
    menu, getMenu, updateCategory, deleteCategory,
  } = useMenuDetail();

  const fetchAllProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    setAllProducts(response);
  };

  const fetchMenuData = async () => {
    const foundCategory = menu.categories.find((category) => category._id === selectedCategoryId);
    setCategoryData(foundCategory);
    setCategoryName(foundCategory.name);
    setCategoryProducts(foundCategory.products);
  };

  useEffect(() => {
    if (selectedCategoryId && router.isReady) {
      fetchMenuData();
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const redirectToEditProduct = (selectedProductId) => {
    router.push(`/product/${selectedProductId}`);
  };

  const addProductsToSelectedCategory = async (productData) => {
    await CATEGORY_SERVICE.addProduct(router.query.menuId, categoryData._id, productData._id);
    const filteredProducts = allProducts.filter((_product) => _product._id !== productData._id);
    setCategoryProducts([...categoryProducts, productData]);
    await getMenu();
    setAllProducts(filteredProducts);
    if (!STORAGE.getLocal("isCompleteMenuBoard")) {
      router.push("/table");
    }
  };

  const removeProductToCategory = (productData) => {
    const response = CATEGORY_SERVICE.removeProduct(router.query.menuId, categoryData._id, productData._id);
    if (response) {
      const filteredCategoryProducts = categoryProducts.filter((product) => product._id !== productData._id);
      setCategoryProducts(filteredCategoryProducts);
      setAllProducts((prev) => [...prev, productData]);
    }
  };

  const categoryImageClickHandler = () => {
    document.querySelector("#category-image-input").click();
  };

  const fileInputChangeHandler = async (e) => {
    const image = e.target.files[0];
    const cdnImage = await CDN_SERVICE.uploadImage(image);
    const newImageUrl = URL.createObjectURL(image);
    setCategoryData((_categoryData) => ({ ..._categoryData, image: newImageUrl }));
    e.target.value = null;
    updateCategory({ _id: categoryData._id, image: cdnImage.data.fileName });
  };

  const categoryNameUpdateHandler = async () => {
    await updateCategory({ _id: categoryData._id, name: categoryData.name });
    setCategoryName(categoryData.name);
  };

  const defaultColumns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fotoğraflar",
      dataIndex: "images",
      key: "images",
      render: (_, record) => (
        <div className="product-images-list">
          {record.images.slice(0, 3).map((item, index) => (
            <div className="images-item">
              <img src={item} alt="kategori" />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "age",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "priceAsText",
    },
  ];

  const categoryProductsColumns = [
    ...defaultColumns,
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <div className="actions">
          <Button onClick={() => removeProductToCategory(record)}>
            <Icon name="delete-outlined" />
            Çıkart
          </Button>
          <Button variant="outlined" onClick={() => redirectToEditProduct(record._id)}>
            <Icon name="edit-outlined" />
            Düzenle
          </Button>
        </div>
      ),
    },
  ];

  const allProductsColumns = [
    ...defaultColumns,
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <div className="actions">
          <Button onClick={() => addProductsToSelectedCategory(record)}> + Ekle</Button>
          <Button variant="outlined" onClick={() => redirectToEditProduct(record._id)}>
            <Icon name="edit-outlined" />
            Düzenle
          </Button>
        </div>
      ),
    },
  ];

  const categoryProductsIds = categoryProducts.map((pd) => pd._id);
  const notAddedProducts = allProducts.filter((product) => !categoryProductsIds.includes(product._id));

  return categoryData && (
    <div className="category-detail">
      <div className="category-preview">
        <div className="category-edit-wrapper">
          <div className="category-title-form">
            <Input value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} />
            {categoryName !== categoryData.name && (
            <div className="save-button-wrapper">
              <Button onClick={() => categoryNameUpdateHandler()}>
                <Icon name="save-outlined" />
                {" "}
                Kaydet
              </Button>
            </div>
            )}
          </div>
          <div className="delete-button-wrapper">
            <Button onClick={() => deleteCategory(categoryData._id)}>
              <Icon name="delete-outlined" />
            </Button>
          </div>
        </div>
        <div className="category-image-wrapper">
          <div className="category-image" onClick={categoryImageClickHandler}>
            <img src={categoryData.image} />
            <div className="edit-icon-wrapper">
              <Icon name="edit-outlined" />
            </div>
          </div>
        </div>
        <input type="file" id="category-image-input" hidden onChange={fileInputChangeHandler} />
      </div>

      <div className="category-detail-list active-products">
        <div className="title">
          <h5>Mevcut Ürünler</h5>
        </div>
        <div className="table-wrapper">
          <Table dataSource={categoryProducts} columns={categoryProductsColumns} pagination={false} />
        </div>
      </div>

      <div className="category-detail-list deactive-products">
        <div className="title">
          <h5>Tüm Ürünler</h5>
        </div>
        <div className="table-wrapper">
          <Table dataSource={notAddedProducts} columns={allProductsColumns} pagination={false} />
        </div>
      </div>
    </div>
  );
}
