import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";
import { LeftCircleFilled } from "@ant-design/icons";
import PRODUCT_SERVICE from "@/services/product";
import { CATEGORY_SERVICE, MENU_SERVICE } from "@/services/menu";
import { STORAGE } from "@/utils/browserStorage";

export default function CategoryProducts() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);

  const fetchAllProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    setAllProducts(response);
  };

  const fetchMenuData = async () => {
    const response = await MENU_SERVICE.detail(router.query.menuId);
    const foundCategory = response.data.categories.find((category) => category._id === router.query.categoryId);
    setCategoryData(foundCategory);
    setCategoryProducts(foundCategory.products);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchMenuData();
    }
  }, [router.isReady]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const redirectToMenuPage = () => {
    router.push(`/menu/${router.query.menuId}`);
  };

  const addProductsToSelectedCategory = async (productData) => {
    await CATEGORY_SERVICE.addProduct(router.query.menuId, categoryData._id, productData._id);
    const filteredProducts = allProducts.filter((_product) => _product._id !== productData._id);
    setCategoryProducts([...categoryProducts, productData]);
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
        <span onClick={() => removeProductToCategory(record)}>çıkart</span>
      ),
    },
  ];

  const allProductsColumns = [
    ...defaultColumns,
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <span onClick={() => addProductsToSelectedCategory(record)}>Ekle</span>
      ),
    },
  ];

  const categoryProductsIds = categoryProducts.map((pd) => pd._id);
  const notAddedProducts = allProducts.filter((product) => !categoryProductsIds.includes(product._id));

  return categoryData && (
    <div>
      <h2>
        <LeftCircleFilled onClick={redirectToMenuPage} style={{ marginRight: 20 }} />
        <span>{categoryData.name}</span>
      </h2>

      <h3>Category Products</h3>
      <Table dataSource={categoryProducts} columns={categoryProductsColumns} pagination={false} />

      <h3>All Products</h3>
      <Table dataSource={notAddedProducts} columns={allProductsColumns} pagination={false} />
    </div>
  );
}
