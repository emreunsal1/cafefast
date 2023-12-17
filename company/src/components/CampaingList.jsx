import React, { useEffect, useState } from "react";
import { Row, FloatButton, Col } from "antd";
import CAMPAIGN_SERVICE from "@/services/campaign";
import { useRouter } from "next/router";
import CampainCard from "./CampainCard";

export default function CampainList() {
  const [campaings, setCampaings] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [campaignsToDelete, setCampaingstoDelete] = useState([]);
  const [isMultipleDeleteActive, setIsMultipleDeleteActive] = useState(false);

  const router = useRouter();

  const getCampaings = async () => {
    const response = await CAMPAIGN_SERVICE.get();
    setCampaings(response.data);
  };
  useEffect(() => {
    if (!isCreate && !isUpdate) {
      getCampaings();
    }
  }, [isCreate, isUpdate]);

  const floatButtonClickHandler = () => {
    router.push("/campaigns/campaign");
  };

  const deleteCampain = async (id) => {
    setIsCreate(false);
    setIsUpdate(false);
    await CAMPAIGN_SERVICE.deleteCampain(id);
    const filteredCampaings = campaings.filter((campain) => campain._id !== id);
    setCampaings(filteredCampaings);
  };

  const deleteMultipleCampaign = async () => {
    await CAMPAIGN_SERVICE.deleteMultipleCampain(campaignsToDelete);
    getCampaings();
  };

  const onMultipleSelectCheckboxClick = (id) => {
    const isInArray = campaignsToDelete.includes(id);
    if (isInArray) {
      setCampaingstoDelete(campaignsToDelete.filter((campaignId) => campaignId !== id));
      return;
    }

    setCampaingstoDelete([...campaignsToDelete, id]);
  };

  const multipleSelectButtonHandler = () => {
    if (isMultipleDeleteActive) {
      setIsMultipleDeleteActive(false);
      setCampaingstoDelete([]);
      return;
    }
    setIsMultipleDeleteActive(true);
    setCampaingstoDelete([]);
  };

  return (
    <div className="list-wrapper">
      <div className="actions-wrapper">
        <button onClick={multipleSelectButtonHandler}>{isMultipleDeleteActive ? "Seçimi Kaldır" : "Seç"}</button>
        {campaignsToDelete.length > 0 && <button onClick={deleteMultipleCampaign}>Seçilileri Sil</button>}
      </div>
      <Row gutter={16}>
        {campaings.length && campaings.map((campain) => (
          <Col key={campain._id} span={8}>
            <CampainCard
              deleteCampain={deleteCampain}
              campaignsToDelete={campaignsToDelete}
              isMultipleDeleteActive={isMultipleDeleteActive}
              onMultipleSelectCheckboxClick={onMultipleSelectCheckboxClick}
              data={campain}
            />
          </Col>
        ))}
      </Row>
      <FloatButton onClick={floatButtonClickHandler} tooltip={<div>Add Campain</div>} />
    </div>
  );
}
