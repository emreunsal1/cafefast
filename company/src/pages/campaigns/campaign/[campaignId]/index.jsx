import React, { useEffect, useState } from "react";
import {
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

import { useImmer } from "use-immer";
import { useLoading } from "@/context/LoadingContext";
import TimePicker from "@/components/library/TimePicker";
import { useDate } from "@/context/DateContext";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "@/components/library/DatePicker";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DEFAULT_DAYS_VALUE = DAYS.map((_, i) => i);

const getImageUrl = (image) => {
  if (image.includes(AWS_CLOUDFRONT_URL)) {
    return image;
  }
  return `${AWS_CLOUDFRONT_URL}/${image}`;
};

const DEFAULT_CAMPAIGN_DATA = {
  name: "",
  description: "",
  image: "",
  price: 0,
  applicable: { time: { start: "", end: "" }, end: "", days: DEFAULT_DAYS_VALUE },
  products: [],
};

const PRODUCT_COLUMNS = [
  {
    title: "İsim",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "Fotoğraflar",
    dataIndex: "images",
    render: (_, record) => record.images.slice(0, 3).map((image) => <img key={image} src={image} />),
  },
  {
    title: "Description",
    dataIndex: "description",
  },
];

function CampaignDetail() {
  const [data, setData] = useImmer(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const router = useRouter();
  const message = useMessage();
  const { moment } = useDate();
  const { loading, setLoading } = useLoading();

  const setCurrentCampaign = (currentData) => {
    const campaignWithProductOnlyWithIds = {
      ...currentData,
      products: currentData.products.map((_p) => _p._id),
    };
    setData(campaignWithProductOnlyWithIds);
  };

  const fetchProducts = async () => {
    setIsProductsLoading(true);
    const response = await PRODUCT_SERVICE.get();
    setIsProductsLoading(false);
    setAllProducts(response);
  };

  const fetchCampaign = async () => {
    setLoading(true);
    const response = await CAMPAIGN_SERVICE.getCampaignDetail(router.query.campaignId);
    setCurrentCampaign(response);
    setLoading(false);
  };

  const onSubmitSuccess = async () => {
    if (!isUpdate) {
      const response = await CAMPAIGN_SERVICE.create(data);
      if (response) {
        message.success("Kampanya başarıyla oluşturuldu!");
      }
      return;
    }

    const response = await CAMPAIGN_SERVICE.update(router.query.campaignId, data);
    if (response) {
      setCurrentCampaign(response.data);
      message.success("Güncelleme başarılı!");
    }
  };

  const daysChangeHandler = (days) => {
    setData((_data) => { _data.applicable.days = days; });
  };

  const timeHandler = (field, momentObject) => {
    const selectedHour = momentObject.hour();
    const selectedMinute = momentObject.minute();

    setData((_data) => { _data.applicable.time[field] = `${selectedHour}:${selectedMinute}`; });
  };

  const createMomentFromApplicableTime = (applicableTime) => {
    const [hour, minute] = applicableTime.split(":");
    return moment({ hour, minute });
  };

  const inputChangeHandler = (key, value) => {
    setData((_data) => { _data[key] = value; });
  };

  const fileInputChangeHandler = async (e) => {
    const image = e.target.files[0];
    const cdnImage = await CDN_SERVICE.uploadImage(image);
    setData((_campaignData) => { _campaignData.image = cdnImage.data.fileName; });
    e.target.value = null;
    if (isUpdate) {
      const response = await CAMPAIGN_SERVICE.update(router.query.campaignId, { image: cdnImage.data.fileName });
      if (response) {
        message.success("Güncelleme başarılı!");
      }
    }
  };

  const campaignImageClickHandler = () => {
    document.querySelector("#campaign-image-input").click();
  };

  const tableProductSelectHandler = (productIds) => { setData((_campaign) => { _campaign.products = productIds; }); };

  useEffect(() => {
    if (router.isReady) {
      if (router.query.campaignId !== "new") {
        setIsUpdate(true);
        fetchCampaign();
        setData(DEFAULT_CAMPAIGN_DATA);
      }
      fetchProducts();
    }
  }, [router.isReady]);

  const scrollToTopOfPagination = () => {
    window.setTimeout(() => {
      document.querySelector(".ant-table-wrapper").scrollIntoView({ block: "start", behavior: "smooth" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {
        !loading && data && (
        <motion.div
          initial={{ opacity: 0, transform: "translate(0, 10px)" }}
          animate={{ opacity: 1, transform: "translate(0, 0)" }}
          exit={{ opacity: 0, transform: "translate(0, 10px)", pointerEvents: "none" }}
          className="campaign-detail"
        >
          <div className="campaign-image-wrapper">
            <div className="campaign-image" onClick={campaignImageClickHandler}>
              <img src={getImageUrl(data.image)} />
              <div className="edit-icon-wrapper">
                <Icon name="edit-outlined" />
              </div>
            </div>
          </div>
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
          <div className="form-row campaign-hours">
            <div className="campaign-hours-header">
              <h5>Aktif Olacağı Saat Aralığı</h5>
              <p>Kampanyanız seçiceğiniz saat aralığında aktif olacaktır.</p>
            </div>
            <div className="campaign-hours-body">
              <div className="hours-wrapper">
                <div className="hours-wrapper-title">
                  Başlangıç
                </div>
                <div className="hours-wrapper-inputs">
                  <TimePicker
                    showSecond={false}
                    value={createMomentFromApplicableTime(data.applicable.time.start)}
                    onChange={(value) => timeHandler("start", value)}
                  />
                </div>
              </div>
              <div className="hours-wrapper">
                <div className="hours-wrapper-title">
                  Bitiş
                </div>
                <div className="hours-wrapper-inputs">
                  <TimePicker
                    showSecond={false}
                    value={createMomentFromApplicableTime(data.applicable.time.end)}
                    onChange={(value) => timeHandler("end", value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row date-picker">
            <div className="date-picker-title">Kampanya Bitiş Tarihi</div>
            <DatePicker onChange={(_data) => { console.log("data :>> ", _data); }} />
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
              loading={isProductsLoading}
              rowClassName="products-table-row"
              rowSelection={{ selectedRowKeys: data.products, onChange: tableProductSelectHandler }}
              columns={PRODUCT_COLUMNS}
              pagination={{ pageSize: 6, onChange: scrollToTopOfPagination }}
              dataSource={allProducts}
            />
          </div>
          <Button onClick={onSubmitSuccess} fluid>
            Kaydet
          </Button>
        </motion.div>
        )
      }
      <input type="file" id="campaign-image-input" hidden onChange={fileInputChangeHandler} />
    </AnimatePresence>
  );
}

export default CampaignDetail;
