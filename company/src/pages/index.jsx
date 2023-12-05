import React, { useEffect } from "react";
import USER_SERVICE from "../services/user";
import { STORAGE } from "@/utils/browserStorage";
import Dropdown from "@/components/library/Dropdown";
import Icon from "@/components/library/Icon";

export default function Index() {
  const menuOnBoardingController = async () => {
    const response = (await USER_SERVICE.me()).data;
    const { data } = response;
    if (STORAGE.getLocal("isCompleteMenuBoard") && !data.company.menus.length) {
      STORAGE.setLocal("isCompleteMenuBoard", false);
      return;
    }
    STORAGE.setLocal("isCompleteMenuBoard", true);
  };

  useEffect(() => {
    menuOnBoardingController();
  }, []);
  return (
    <div className="homepage">
      <h3>ANASAYFA</h3>
    </div>
  );
}
