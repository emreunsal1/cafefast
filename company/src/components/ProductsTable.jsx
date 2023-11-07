import { Button } from "antd";
import React from "react";
import { useRouter } from "next/router";
import { CATEGORY_SERVICE } from "@/services/menu";
import { useMenuDetail } from "@/context/MenuContext";

export default function ProductsTable({ selectedCategory, data }) {
  const router = useRouter();
  const { getMenu } = useMenuDetail();

  const deleteButtonClikHandler = async (id) => {
    await CATEGORY_SERVICE.removeProduct(router.query.menuId, selectedCategory._id, data._id);
    getMenu(router.query.menuId);
  };
  const editButtonClickHandler = (id) => {};
  const colums = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "priceAsText",
      key: "priceAsText",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <>
          <Button onClick={() => editButtonClickHandler(record._id)}>edit</Button>
          <Button onClick={() => deleteButtonClikHandler(record._id)}>delete</Button>
        </>
      ),
    },

  ];
  return (
    <div />
  );
}
