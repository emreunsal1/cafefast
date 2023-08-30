import React from "react";
import { Space, Checkbox, Table } from "antd";
import { ORDER_STATUSES } from "@/constants";
import COMPANY_SERVICE from "@/services/company";
import { copyText } from "@/utils/copy";

export default function OrderList({ data, onUpdate }) {
  const approvedUpdateHandler = (event) => [
    console.log("event", event),
  ];

  const statusOnChangeHandler = async (orderId, status) => {
    const updated = await COMPANY_SERVICE.updateOrder(orderId, { status });
    onUpdate(orderId, updated.data);
  };

  const columns = [
    {
      title: "Sipariş Numarası",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (<span onClick={() => copyText(id)}>Kopyala</span>),
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
      render: (statusValue, _record) => (
        <Space>
          <select value={statusValue} onChange={(e) => statusOnChangeHandler(_record._id, e.target.value)}>
            {ORDER_STATUSES.map((status) => (<option value={status}>{status}</option>))}
          </select>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table rowKey="_id" columns={columns} dataSource={data} />
    </div>
  );
}