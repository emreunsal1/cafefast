/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CAMPAIGN_SERVICE from "@/services/campaign";
import CategoryDetail from "@/components/CategoryDetail";
import MenuCampaingDetail from "@/components/MenuCampaingDetail";
import { MenuDetailContext, useMenuDetail } from "../../../context/MenuDetailContext";
import CategorySideBar from "../../../components/CategorySideBar";

function MenuDetail() {
  const {
    getMenu,
    campaings,
    removeCampaings,
    selectedCategoryId,
    menu,
  } = useMenuDetail();

  const [isAddCampaing, setIsAddCampaing] = useState(false);
  const [allCampaings, setAllCampaings] = useState([]);

  const router = useRouter();

  const getCampaings = async () => {
    const response = await CAMPAIGN_SERVICE.get();
    const { data } = response;

    if (campaings.length) {
      const notIncludesCampaings = campaings.map((item) => {
        const filteredData = data.filter((campaing) => campaing._id !== item._id);
        return filteredData;
      })[0];
      setAllCampaings(notIncludesCampaings);
      return;
    }
    setAllCampaings(data);
  };

  const addCampaingClickHandler = async (campain) => {
    const response = await CAMPAIGN_SERVICE.addCampaingToMenu(router.query.menuId, campain._id);
    if (response) {
      campaings.push(campain);
      const filterAllCampaings = allCampaings.filter((_campain) => _campain._id !== campain._id);
      setAllCampaings(filterAllCampaings);
    }
  };

  const removeClickHandler = async (campain) => {
    try {
      removeCampaings(router.query.menuId, campain);
      setAllCampaings([...allCampaings, campain]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      console.log("geldii");
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (isAddCampaing && selectedCategoryId === null) {
      getCampaings();
    }
  }, [isAddCampaing, selectedCategoryId]);

  return (
    <div className="menu-detail-page">
      {menu && (
      <>
        <CategorySideBar />
        {selectedCategoryId && (
        <div className="menu-detail-body-wrapper">
          <CategoryDetail />
        </div>
        )}
        {!selectedCategoryId && (
        <div className="menu-detail-campaings-wrapper">
          <MenuCampaingDetail />
        </div>
        )}
      </>
      )}
    </div>
  );
}

export default function () {
  return <MenuDetailContext><MenuDetail /></MenuDetailContext>;
}
