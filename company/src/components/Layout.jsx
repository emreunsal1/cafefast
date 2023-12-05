import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { STORAGE } from "@/utils/browserStorage";

export default function Layout({ children }) {
  const [sideBarIsOpened, setSideBarIsOpened] = useState();
  const sideBarButtonClickHandler = () => {
    if (sideBarIsOpened === false) {
      STORAGE.setLocal("sideMenuOpened", true);
      setSideBarIsOpened(true);
      return;
    }
    STORAGE.setLocal("sideMenuOpened", false);
    setSideBarIsOpened(false);
  };

  useEffect(() => {
    setSideBarIsOpened(STORAGE.getLocal("sideMenuOpened"));
  }, []);

  return (
    <div className="layout">
      <SideBar isOpened={sideBarIsOpened} />
      <div className="main" style={{ width: "100%" }}>
        <Header sideBarButtonClickHandler={sideBarButtonClickHandler} sideBarIsOpened={sideBarIsOpened} />
        <main>{children}</main>
      </div>
    </div>
  );
}
