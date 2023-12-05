import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";
import { LeftCircleFilled } from "@ant-design/icons";
import PRODUCT_SERVICE from "@/services/product";
import { CATEGORY_SERVICE, MENU_SERVICE } from "@/services/menu";
import { STORAGE } from "@/utils/browserStorage";
import { useMenuDetail } from "@/context/MenuContext";
import Button from "./library/Button";
import Icon from "./library/Icon";
import { useLoading } from "@/context/LoadingContext";

export default function CategoryDetail() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const { selectedCategory } = useMenuDetail();

  const { loading, setLoading } = useLoading();
  const { menu, getMenu } = useMenuDetail();

  const fetchAllProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    setAllProducts(response);
  };

  const fetchMenuData = async () => {
    const foundCategory = menu.categories.find((category) => category._id === selectedCategory._id);
    setCategoryData(foundCategory);
    setCategoryProducts(foundCategory.products);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCategory && router.isReady) {
      setLoading(true);
      fetchMenuData();
    }
  }, [selectedCategory]);

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
    await getMenu(router.query.menuId);
    setAllProducts(filteredProducts);
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
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

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "age",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const categoryProductsColumns = [
    ...defaultColumns,
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <Button onClick={() => removeProductToCategory(record)}>
          <Icon name="delete-outlined" />
          Çıkart
        </Button>
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
      <div className="selected-category-name">
        <h3>
          {categoryData.name}
        </h3>
      </div>

      <div className="active-products">
        <div className="title">
          <h5>Mevcut Ürünler</h5>
        </div>
        <div className="table-wrapper">
          <Table dataSource={categoryProducts} columns={categoryProductsColumns} pagination={false} />
        </div>
      </div>

      <div className="deactive-products">
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
