import {
  Button, Form, Input, Select,
  Space,
} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DEFAULT_DAYS_VALUE = DAYS.map((_, i) => i);
const HOURS = Array(24).fill(null).map((_, i) => i + 1);

function CampaignDetail() {
  const [data, setData] = useState({ });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      // Fetch Menu Data
    }
  }, [router.isReady]);

  const campaignId = router.isReady && router.query.campaignId?.[0];

  const onFinish = (formData) => {
    setData({
      ...data,
      ...formData,
    });
  };

  const daysChangeHandler = (days) => {
    setData({
      ...data,
      days,
    });
  };

  const timeHandler = (field, value) => {
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 900 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="İsim"
        name="name"
        rules={[{ required: true, message: "Lütfen bir isim giriniz" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Açıklama"
        name="password"
        rules={[{ required: true, message: "Lütfen bir açıklama giriniz" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Fiyat"
        name="price"
        rules={[{ required: true, message: "Lütfen fiyat giriniz." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Geçerlilik Günleri"
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          onChange={daysChangeHandler}
          defaultValue={DEFAULT_DAYS_VALUE}
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
        name=""
      >
        <Select onChange={timeHandler}>
          {HOURS.map((hour) => (
            <Select.Option key={hour} value={hour}>
              {/* <Space>{i % 10 }</Space> */}
            </Select.Option>
          ))}
        </Select>
        <p>Bu alan zorunlu değildir. Kampanyanız sadece seçtiğiniz tarih arasında aktif olur.</p>
      </Form.Item>

      <Form.Item
        label="Ürünler"
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          onChange={daysChangeHandler}
          defaultValue={DEFAULT_DAYS_VALUE}
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
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Button type="primary" htmlType="submit">
          {campaignId ? "Kaydet" : "Oluştur"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CampaignDetail;
