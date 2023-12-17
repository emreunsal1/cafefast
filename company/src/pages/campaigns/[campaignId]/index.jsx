import {
  Button,
  Form,
  Select,
  Space,
  Table,
} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PRODUCT_SERVICE from "@/services/product";
import CAMPAIGN_SERVICE from "@/services/campaign";
import Input from "@/components/library/Input";
import { useMessage } from "@/context/GlobalMessage";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DEFAULT_DAYS_VALUE = DAYS.map((_, i) => i);
const HOURS = Array(24).fill(null).map((_, i) => i + 1);

function CampaignDetail() {
  const [data, setData] = useState({ name: "", description: "", price: 0 });
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [applicable, setApplicable] = useState({ days: DEFAULT_DAYS_VALUE });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const router = useRouter();
  const message = useMessage();

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

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await PRODUCT_SERVICE.get();
    console.log("working fetch products", response);
    setAllProducts(response);
    setIsLoading(false);
  };

  const getCampaign = async () => {
    const response = await CAMPAIGN_SERVICE.getCampaignDetail(router.query.campaignId);
    setData(response);
    const activeProductIds = response.products.map((product) => product._id);
    setSelectedProducts(activeProductIds);
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
    if (router.isReady) {
      fetchProducts();
      setApplicable({ days: DEFAULT_DAYS_VALUE });
      if (router.query.campaignId) {
        setIsUpdate(true);
        getCampaign();
      }
    }
  }, [router.isReady]);

  const onSubmitSuccess = async () => {
    const submitData = {
      ...data,
      applicable,
      image: "https://http.cat/images/100.jpg",
      products: selectedProducts,
    };

    if (!isUpdate) {
      const response = await CAMPAIGN_SERVICE.create(submitData);
      if (response) {
        message.success("Kampanya başarıyla oluşturuldu!");
      }
      return;
    }

    const response = await CAMPAIGN_SERVICE.update(router.query.campaignId, submitData);
    if (response) {
      setCurrentCampaign(response.data);
      message.success("Güncelleme başarılı!");
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
      style={{ maxWidth: 900 }}
      onFinish={onSubmitSuccess}
      autoComplete="off"
    >
      <h2>Kampanyanı Düzenle!</h2>
      <Input
        label="Kampanya İsmi"
        value={data.name}
        onChange={(e) => inputChangeHandler("name", e.target.value)}
      />
      <Input
        label="Açıklama"
        description="Kampanyanızda gözükecek açıklamayı giriniz"
        value={data.description}
        onChange={(e) => inputChangeHandler("description", e.target.value)}
      />
      <Input
        label="Fiyat"
        description="Kampanyanızın toplam fiyatını giriniz"
        value={data.price}
        onChange={(e) => inputChangeHandler("price", Number(e.target.value))}
      />
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
          {isUpdate ? "Kaydet" : "Oluştur"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CampaignDetail;
