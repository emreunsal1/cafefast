import React from "react";
import { Space, Table } from "antd";
import { ORDER_STATUSES, ORDER_STATUS_TEXTS } from "@/constants";
import COMPANY_SERVICE from "@/services/company";
import { copyText } from "@/utils/copy";
import { useDate } from "@/context/DateContext";
import Button from "./library/Button";
import { useMessage } from "@/context/GlobalMessage";
import Select from "./library/Select";

export default function OrderList({ data, onUpdate }) {
  const { formatDate } = useDate();
  const message = useMessage();
  const statusOnChangeHandler = async (orderId, status) => {
    const updated = await COMPANY_SERVICE.updateOrder(orderId, { status });
    onUpdate(orderId, updated.data);
  };

  const columns = [
    {
      title: "Sipariş Numarası",
      dataIndex: "_id",
      key: "_id",
      width: 150,
      align: "center",
      render: (id) => (
        <Button onClick={() => {
          message.success("Sipariş numarası kopyalandı.");
          copyText(id);
        }}
        >
          Kopyala
        </Button>
      ),
    },
    {
      title: "Toplam Fiyat",
      key: "totalPriceText",
      dataIndex: "totalPriceText",
    },
    {
      title: "Ürünler",
      dataIndex: "products",
      render: (productData) => productData.map((item) => <Space key={item.product._id}>{item.product.name}</Space>),
      key: "products",
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <Space>
          {formatDate(createdAt)}
        </Space>
      ),
    },
    {
      title: "Sipariş Durumu",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (statusValue, _record) => (
        <Select
          value={{ value: statusValue, label: ORDER_STATUS_TEXTS[statusValue] }}
          onChange={(selectedOption) => statusOnChangeHandler(_record._id, selectedOption.value)}
          options={ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_TEXTS[status] }))}
        />
      ),
    },
  ];
  return (
    <div>
      <Table rowKey="_id" columns={columns} dataSource={data} />
    </div>
  );
}
