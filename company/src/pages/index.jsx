import React, { useEffect } from "react";
import MenuBar from "../components/MenuBar";
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

  return (
    <div>
      <div className="menu">
        <MenuBar />
      </div>
      burası main page register veya login olduk yupiii!!
    </div>
  );
}

Index.getLayout = function getLayout(index) {
  return (
    <Layout>
      {index}
    </Layout>
  );
};
