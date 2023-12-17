import React from "react";
import { Space, Table } from "antd";
import { ORDER_STATUSES, ORDER_STATUS_TEXTS } from "@/constants";
import COMPANY_SERVICE from "@/services/company";
import { useDate } from "@/context/DateContext";
import { useRouter } from "next/router";
import Button from "./library/Button";
import Select from "./library/Select";
import Icon from "./library/Icon";

export default function OrderList({ data, onUpdate }) {
  const { formatDate } = useDate();
  const router = useRouter();

  const statusOnChangeHandler = async (orderId, status) => {
    const updated = await COMPANY_SERVICE.updateOrder(orderId, { status });
    onUpdate(orderId, updated.data);
  };

  const createStatusItem = (status) => ({ value: status, label: ORDER_STATUS_TEXTS[status] });

  const columns = [
    {
      title: "",
      dataIndex: "_id",
      key: "_id",
      width: 150,
      align: "center",
      render: (orderId) => (
        <Button onClick={() => {
          router.push(`/kitchen/${orderId}`);
        }}
        >
          Detay
          <Icon name="right-chevron" />
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
      render: (productData) => productData.map((item) => <Space key={item._id}>{item.name}</Space>),
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
          value={createStatusItem(statusValue)}
          onChange={(selectedOption) => statusOnChangeHandler(_record._id, selectedOption.value)}
          options={ORDER_STATUSES.map(createStatusItem)}
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
