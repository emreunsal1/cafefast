import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import cafeFastIcon from "../public/images/cafeFastIcon.png";

export default function Header({ sideBarButtonClickHandler }) {
  const router = useRouter();
  return (
    <div className="header-layout">
      <div className="header-container">
        <div className="header-left">
          <div className="button-wrapper" onClick={sideBarButtonClickHandler}>
            <i className="icon icon-sidemenu" />
          </div>
        </div>
        <div className="header-center">
          <div className="header-company-icon-wrapper" onClick={() => router.push("/")}>
            <Image src={cafeFastIcon} />
          </div>
        </div>
        <div className="header-right">
          <div className="profile" onClick={() => router.push("/profile")}>
            <i className="icon icon-profile" />
          </div>
          <div className="logout">
            <i className="icon icon-exit" />
          </div>
        </div>
      </div>
    </div>
  );
}
