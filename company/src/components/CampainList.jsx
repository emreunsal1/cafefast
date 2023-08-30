import React, { useEffect, useState } from "react";
import { Row, FloatButton } from "antd";
import CAMPAIGN_SERVICE from "@/services/campaign";
import CampainCard from "./CampainCard";
import AddCampain from "./AddCapmaing";

export default function CampainList() {
  const [campaings, setCampaings] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

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
    setIsUpdate(false);
    setIsCreate(true);
  };

  const deleteCampain = async (id) => {
    await CAMPAIGN_SERVICE.deleteCampain(id);
    const filteredCampaings = campaings.filter((campain) => campain._id !== id);
    setCampaings(filteredCampaings);
  };
  return (
    <div className="list-wrapper">

      <Row gutter={16}>
        {campaings.length && campaings.map((campain) => <CampainCard deleteCampain={deleteCampain} setIsUpdate={setIsUpdate} data={campain} />)}
      </Row>
      {(isCreate || isUpdate) && (
      <AddCampain action={{
        key: isUpdate ? "update" : "create",
        value: isUpdate,
        updateState: (value) => (isUpdate ? setIsUpdate(value) : setIsCreate(value)),
      }}
      />
      )}
      <FloatButton onClick={floatButtonClickHandler} tooltip={<div>Add Campain</div>} />
    </div>
  );
}
