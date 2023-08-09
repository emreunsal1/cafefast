import React from "react";
import { Space, Checkbox, Table } from "antd";

export default function OrderList({ data }) {
  const approvedUpdateHandler = (event) => [
    console.log("event", event),
  ];

  const columns = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Total Price",
      key: "totalPriceText",
      dataIndex: "totalPriceText",
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (productData) => productData.map((item) => <Space key={item.product._id}>{item.product.name}</Space>),
      key: "products",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Approved",
      dataIndex: "approved",
      render: (isApproved, _record) => (
        <Space>
          <Checkbox onChange={() => approvedUpdateHandler(_record)} />
          {String(isApproved)}
        </Space>
      ),
      key: "approved",
    },

  ];
  return (
    <div>
      <Table rowKey="_id" columns={columns} dataSource={data} />
    </div>
  );
}
