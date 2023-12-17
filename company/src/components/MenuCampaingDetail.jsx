import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";
import CAMPAIGN_SERVICE from "@/services/campaign";
import { useMenuDetail } from "@/context/MenuDetailContext";
import Button from "./library/Button";
import Icon from "./library/Icon";

export default function MenuCampaingDetail() {
  const router = useRouter();
  const [allCampaings, setAllCampaings] = useState([]);

  const { menu, getMenu } = useMenuDetail();

  const fetchAllCampaing = async () => {
    const response = await CAMPAIGN_SERVICE.get();
    setAllCampaings(response.data);
  };

  useEffect(() => {
    fetchAllCampaing();
  }, [menu]);

  const redirectToEditProduct = (selectedProductId) => {
    router.push(`/product/${selectedProductId}`);
  };

  const addCampaingToMenu = async (campaingData) => {
    await CAMPAIGN_SERVICE.addCampaingToMenu(router.query.menuId, campaingData._id);
    getMenu();
  };

  const removeCampaingToMenu = async (campaingData) => {
    await CAMPAIGN_SERVICE.removeCampaingFromMenu(router.query.menuId, campaingData._id);
    getMenu();
  };

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const activeCampaingsColumn = [
    ...defaultColumns,
    {
      dataIndex: "",
      render: (_, record) => (
        <Button onClick={() => removeCampaingToMenu(record)}>
          <Icon name="delete-outlined" />
          Çıkart
        </Button>
      ),
    },
  ];

  const allProductsColumns = [
    ...defaultColumns,
    {
      dataIndex: "",
      render: (_, record) => (
        <div className="actions">
          <Button onClick={() => addCampaingToMenu(record)}> + Ekle</Button>
          <Button variant="outlined" onClick={() => redirectToEditProduct(record._id)}>
            <Icon name="edit-outlined" />
            Düzenle
          </Button>
        </div>
      ),
    },
  ];

  const activeCampaingsId = menu?.campaigns.map((pd) => pd._id);
  const deActiveCampaings = allCampaings?.filter((campaing) => !activeCampaingsId?.includes(campaing._id));

  return deActiveCampaings && menu && (
    <div className="menu-campaing-detail">
      <div className="menu-campaing-title">
        <h4>Kampanlayar</h4>
      </div>
      <div className="menu-campaing-body">
        <div className="active-campaings">
          <div className="title">
            <h5>Aktif Kampanyalar</h5>
          </div>
          <div className="table-wrapper">
            <Table dataSource={menu.campaigns} columns={activeCampaingsColumn} pagination={false} />
          </div>
        </div>
        <div className="deactive-campaings">
          <div className="title">
            <h5>Tüm Kampanyalar</h5>
          </div>
          <div className="table-wrapper">
            <Table dataSource={deActiveCampaings} columns={allProductsColumns} pagination={false} />
          </div>
        </div>
      </div>

    </div>

  );
}
