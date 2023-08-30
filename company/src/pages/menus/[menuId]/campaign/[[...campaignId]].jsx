import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table } from "antd";
import CampaignDetail from "@/components/AddCapmaing";

export default function CategoryProducts() {
  const router = useRouter();
  const redirectToMenuPage = () => {
    router.push(`/menus/${router.query.menuId}`);
  };

  return (
    <div>
      <CampaignDetail />
    </div>
  );
}
