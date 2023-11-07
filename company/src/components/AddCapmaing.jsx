import {
  Button, Form, Input, Select,
  Space,
  Table,
} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PRODUCT_SERVICE from "../services/product";
import CAMPAIGN_SERVICE from "../services/campaign";
import { MENU_SERVICE } from "../services/menu";
import { useMessage } from "@/context/GlobalMessage";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DEFAULT_DAYS_VALUE = DAYS.map((_, i) => i);
const HOURS = Array(24).fill(null).map((_, i) => i + 1);

const PRODUCT_COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
];

function CampaignDetail({ action }) {
  const [data, setData] = useState({ name: "", description: "", price: 0 });
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [applicable, setApplicable] = useState({ days: DEFAULT_DAYS_VALUE });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const message = useMessage();

  const campaing = action.key === "update" ? action.value : false;

  const fetchProducts = async () => {
    const response = await PRODUCT_SERVICE.get();
    setAllProducts(response);
  };

  const setCurrentCampaign = (currentData) => {
    setData({
      name: currentData.name,
      description: currentData.description,
      price: currentData.price,
    });

    const productIds = currentData.products.map((product) => product._id || product);
    setSelectedProducts(productIds);
    setApplicable(currentData.applicable);
  };

  useEffect(() => {
    fetchProducts();
    setData({ name: "", description: "", price: 0 });
    setApplicable({ days: DEFAULT_DAYS_VALUE });
    if (campaing) {
      setCurrentCampaign(action.value);
    }
  }, [action]);

  const onSubmitSuccess = async () => {
    const submitData = {
      ...data,
      applicable,
      image: "https://http.cat/images/100.jpg",
      products: selectedProducts,
    };

    if (!campaing) {
      const response = await CAMPAIGN_SERVICE.create(submitData);
      if (response) {
        message("success", "Kampanya başarıyla oluşturuldu!");
        action.updateState(false);
      }
      return;
    }

    const response = await CAMPAIGN_SERVICE.update(campaing._id, submitData);
    if (response) {
      setCurrentCampaign(response.data);
      message("success", "Güncelleme başarılı!");
      action.updateState(false);
    }
  };

  const daysChangeHandler = (days) => {
    setApplicable({
      ...applicable,
      days,
    });
  };

  const timeHandler = (field, value) => {
    setApplicable({
      ...applicable,
      time: {
        ...applicable.time,
        [field]: Number(value),
      },
    });
  };

  const inputChangeHandler = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  if (!router.isReady || isLoading) {
    return null;
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 900 }}
      onFinish={onSubmitSuccess}
      autoComplete="off"
    >
      <h2>Kampanyanı Düzenle!</h2>
      <Form.Item
        label="İsim"
        rules={[{ required: true, message: "Lütfen bir isim giriniz" }]}
      >
        <Input value={data.name} onChange={(e) => inputChangeHandler("name", e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Açıklama"
        rules={[{ required: true, message: "Lütfen bir açıklama giriniz" }]}
      >
        <Input value={data.description} onChange={(e) => inputChangeHandler("description", e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Fiyat"
        rules={[{ required: true, message: "Lütfen fiyat giriniz." }]}
      >
        <Input value={data.price} onChange={(e) => inputChangeHandler("price", Number(e.target.value))} />
      </Form.Item>
      <Form.Item
        label="Geçerlilik Günleri"
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={applicable.days}
          onChange={daysChangeHandler}
        >
          {DAYS.map((day, i) => (
            <Select.Option key={i} value={i} label={day}>
              <Space>{day}</Space>
            </Select.Option>
          ))}
        </Select>
        <p>Kampanyanız sadece seçtiğiniz günler için geçerli olacaktır.</p>
      </Form.Item>
      <Form.Item
        label="Geçerlilik Saat Aralığı"
      >
        <Form.Item style={{ width: "50%", display: "inline-block" }}>
          <Select
            placeholder="Başlangıç"
            value={applicable.time?.start}
            onChange={(start) => timeHandler("start", start)}
          >
            {HOURS.map((hour) => (
              <Select.Option key={hour} value={hour}>
                <Space>{hour}</Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ width: "50%", display: "inline-block" }}
        >
          <Select
            placeholder="Bitiş"
            disabled={!applicable.time?.start}
            value={applicable.time?.end}
            onChange={(end) => timeHandler("end", end)}
          >
            {applicable.time?.start && HOURS.map((hour) => (
              <Select.Option disabled={hour < applicable.time.start + 1} key={hour} value={hour}>
                <Space>{hour}</Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <p>Bu alan zorunlu değildir. Kampanyanız sadece seçtiğiniz tarih arasında aktif olur.</p>
      </Form.Item>
      <Form.Item
        label="Ürünler"
      >
        <Table
          rowKey="_id"
          rowSelection={{ selectedRowKeys: selectedProducts, onChange: setSelectedProducts }}
          columns={PRODUCT_COLUMNS}
          dataSource={allProducts}
        />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Button type="primary" htmlType="submit">
          {campaing ? "Kaydet" : "Oluştur"}
        </Button>
        <Button type="danger" onClick={() => action.updateState(false)}>Vazgeç</Button>
      </Form.Item>
    </Form>
  );
}

export default CampaignDetail;
