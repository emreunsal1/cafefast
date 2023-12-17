import { Button, Table } from "antd";
import React from "react";
import { useRouter } from "next/router";
import { CATEGORY_SERVICE } from "@/services/menu";
import { useMenuDetail } from "@/context/MenuDetailContext";

export default function ProductsTable({ selectedCategory, data }) {
  const router = useRouter();
  const { getMenu } = useMenuDetail();

  const deleteButtonClikHandler = async (id) => {
    await CATEGORY_SERVICE.removeProduct(router.query.menuId, selectedCategory, id);
    getMenu();
  };

  const editButtonClickHandler = (id) => {
    router.push(`/product/${id}`);
  };
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
      render: (_, record) => record.images.map((image) => <img width={50} height={50} src={image} alt="." />),
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
    <div>
      {data && <Table columns={colums} dataSource={data} /> }

    </div>
  );
}
