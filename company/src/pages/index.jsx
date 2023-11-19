import React, { useEffect } from "react";
import USER_SERVICE from "../services/user";
import Layout from "@/components/Layout";
import { STORAGE } from "@/utils/browserStorage";

export default function Index() {
  const menuOnBoardingController = async () => {
    const response = (await USER_SERVICE.me()).data;
    const { data } = response;
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false" && !data.company.menus.length) {
      STORAGE.setLocal("isCompleteMenuBoard", false);
      return;
    }
    STORAGE.setLocal("isCompleteMenuBoard", true);
  };

  useEffect(() => {
    menuOnBoardingController();
  }, []);

  return <div id="homepage"><h1>HOMEPAGE</h1></div>;
}
