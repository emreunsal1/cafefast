import React, { useEffect, useState } from "react";
import {
  Form,
  Space,
  Table,
  Select as AntdSelect,
} from "antd";
import { useRouter } from "next/router";
import PRODUCT_SERVICE from "@/services/product";
import CAMPAIGN_SERVICE from "@/services/campaign";
import Input from "@/components/library/Input";
import { useMessage } from "@/context/GlobalMessage";
import Button from "@/components/library/Button";
import LibSelect from "@/components/library/Select";
import Icon from "@/components/library/Icon";
import { CDN_SERVICE } from "@/services/cdn";
import { AWS_CLOUDFRONT_URL } from "@/constants";
import z, { ZodError } from "zod";
import { useImmer } from "use-immer";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DEFAULT_DAYS_VALUE = DAYS.map((_, i) => i);
const HOURS = Array(23).fill(null).map((_, i) => i + 1);
const MINUTES = Array(5).fill(null).map((_, i) => (i + 1) * 10);

function CampaignDetail() {
  const [data, setData] = useImmer({
    name: "",
    description: "",
    price: 0,
    applicable: { time: { start: "", end: "" }, days: DEFAULT_DAYS_VALUE },
  });
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const router = useRouter();
  const message = useMessage();

  const campaignVerifier = z.object({
    name: z.string(),
    description: z.string().min(3).max(255),
    price: z.literal(7),
  });

  const PRODUCT_COLUMNS = [
    {
      title: "İsim",
      dataIndex: "name",
    },
    {
      title: "Fotoğraflar",
      dataIndex: "images",
      render: (_, record) => record.images.slice(0, 3).map((image) => <img width={50} height={50} key={image} src={image} alt="." />),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await PRODUCT_SERVICE.get();
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
      image: currentData.image,
    });

    const productIds = currentData.products.map((product) => product._id || product);
    setSelectedProducts(productIds);
  };

  const onSubmitSuccess = async () => {
    const mockData = data;
    const submitData = {
      ...mockData,
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

  const timeHandler = (field, type, value) => {
    if (field === "start") {
      const [hour, minute] = data.applicable.time.start.split(":");
      const currentHour = type === "hour" ? value : hour;
      const currentMinute = type === "minute" ? value : minute;
      setData((_data) => { _data.applicable.time.start = `${currentHour}:${currentMinute}`; });
    }

    if (field === "end") {
      const [hour, minute] = data.applicable.time.end.split(":");
      const currentHour = type === "hour" ? value : hour;
      const currentMinute = type === "minute" ? value : minute;
      setData((_data) => { _data.applicable.time.end = `${currentHour}:${currentMinute}`; });
    }
  };

  const inputChangeHandler = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const campaignImageClickHandler = () => {
    document.querySelector("#campaign-image-input").click();
  };

  const fileInputChangeHandler = async (e) => {
    const image = e.target.files[0];
    const cdnImage = await CDN_SERVICE.uploadImage(image);
    setData((_campaignData) => ({ ..._campaignData, image: `${AWS_CLOUDFRONT_URL}/${cdnImage.data.fileName}` }));
    e.target.value = null;
    if (isUpdate) {
      const response = await CAMPAIGN_SERVICE.update(router.query.campaignId, { image: cdnImage.data.fileName });
      if (response) {
        message.success("Güncelleme başarılı!");
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchProducts();
      setData((_data) => { _data.applicable.days = DEFAULT_DAYS_VALUE; });
      if (router.query.campaignId !== "new") {
        setIsUpdate(true);
        getCampaign();
      }
    }
  }, [router.isReady]);

  return (
    <div className="campaign-detail">
      <div className="campaign-image-wrapper">
        <div className="campaign-image" onClick={campaignImageClickHandler}>
          <img src={data.image} />
          <div className="edit-icon-wrapper">
            <Icon name="edit-outlined" />
          </div>
        </div>
      </div>
      <input type="file" id="campaign-image-input" hidden onChange={fileInputChangeHandler} />
      <Form
        onFinish={onSubmitSuccess}
        autoComplete="off"
      >
        <div className="title-wrapper">
          {isUpdate ? <h3>Kampanyanı Düzenle!</h3> : <h3>Kampanyanı Oluştur!</h3> }
        </div>
        <div className="form-row">
          <Input
            label="Kampanya İsmi"
            value={data.name}
            onChange={(e) => inputChangeHandler("name", e.target.value)}
          />
        </div>
        <div className="form-row">
          <Input
            label="Açıklama"
            value={data.description}
            onChange={(e) => inputChangeHandler("description", e.target.value)}
          />
        </div>
        <div className="form-row">
          <Input
            label="Fiyat"
            value={data.price}
            onChange={(e) => inputChangeHandler("price", Number(e.target.value))}
          />
        </div>
        <div className="form-row">
          <div className="options-line-time">
            <div className="row">
              <LibSelect
                label="Aktif Olacağı Saat"
                onChange={(start) => timeHandler("start", "hour", start.value)}
                options={HOURS.map((hour) => ({ label: hour, value: hour }))}
                name="startTime"
              />
              <LibSelect
                onChange={(end) => timeHandler("start", "minute", end.value)}
                options={MINUTES.map((hour) => ({ label: hour, value: hour }))}
                name="startMınute"
              />
            </div>
            <div className="row">
              <LibSelect
                label="Bitiş Saat"
                onChange={(start) => timeHandler("end", "hour", start.value)}
                options={HOURS.map((hour) => ({ label: hour, value: hour }))}
                name="startTime"
              />
              <LibSelect
                onChange={(end) => timeHandler("end", "minute", end.value)}
                options={MINUTES.map((hour) => ({ label: hour, value: hour }))}
                name="endTime"
              />
            </div>
          </div>
          <div className="options-line">
            <LibSelect
              label="Bitiş Tarihi"
              onChange={(end) => timeHandler("end", end.value)}
              options={HOURS.map((hour) => ({ label: hour, value: hour }))}
            />
          </div>
          <div className="info">
            <p>Bu alan zorunlu değildir. Kampanyanız sadece seçtiğiniz tarih arasında aktif olur.</p>
          </div>
        </div>
        <div className="form-row">
          <div className="title">
            Kampanyanın Aktif Olduğu Günler (Kampanyanız sadece seçtiğiniz günler için geçerli olacaktır.)
          </div>
          <AntdSelect
            mode="multiple"
            style={{ width: "100%" }}
            value={data.applicable?.days}
            onChange={daysChangeHandler}
          >
            {DAYS.map((day, i) => (
              <AntdSelect.Option key={day} value={i} label={day}>
                <Space>{day}</Space>
              </AntdSelect.Option>
            ))}
          </AntdSelect>
        </div>
        <div className="table-wrapper">
          <Table
            rowKey="_id"
            rowSelection={{ selectedRowKeys: selectedProducts, onChange: setSelectedProducts }}
            columns={PRODUCT_COLUMNS}
            dataSource={allProducts}
          />
        </div>
        <div className="button-wrapper">
          <Button hmtlType="submit" fluid>
            Kaydet
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CampaignDetail;
