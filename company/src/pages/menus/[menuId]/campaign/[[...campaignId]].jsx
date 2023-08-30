import React from "react";
import { useRouter } from "next/router";
import CampaignDetail from "@/components/CampaignDetail";

export default function CategoryProducts() {
  const router = useRouter();
  // TODO: product'lardaki gibi sadece kampanyayı menüye ekleyip çıkarabiliceğimiz bir ekran gelmeli

  const redirectToMenuPage = () => {
    router.push(`/menus/${router.query.menuId}`);
  };

  return (
    <div>
      <CampaignDetail />
    </div>
  );
}
