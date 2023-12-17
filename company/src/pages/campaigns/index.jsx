import React from "react";

import CampainList from "@/components/CampaingList";

export default function Index() {
  return (
    <div className="campaigns-page">
      <h3>Kampanyalarım</h3>
      <CampainList />
    </div>
  );
}
