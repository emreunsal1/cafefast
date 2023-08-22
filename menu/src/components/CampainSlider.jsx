import React, { useEffect } from "react";
import { Carousel, Button } from "antd";
import { useMenu } from "@/context/Menu";
import BASKET_SERVICE from "@/services/basket";

export default function CampainSlider() {
  const { campaigns } = useMenu();
  const addToBasket = (campaignId) => {
    BASKET_SERVICE.addToBasket({ companyId: "64208d2c890cdcf8376c87a5", campaignId });
  };
  useEffect(() => {
    console.log("campan", campaigns);
  }, []);

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <div style={{ margin: "20px" }}>
      <Carousel>
        {campaigns.map((campaignId, index) => (
          <div key={index}>
            <div className="content" style={contentStyle}>
              {campaignId.name}
              <Button onClick={() => addToBasket(campaignId._id)}>Sepete Ekle</Button>
            </div>

          </div>
        ))}
      </Carousel>
    </div>
  );
}
