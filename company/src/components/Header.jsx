import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import classNames from "classnames";
import cafeFastIcon from "../public/images/cafeFastIcon.png";
import AUTH_SERVICE from "@/services/auth";

export default function Header({ sideBarButtonClickHandler, sideBarIsOpened }) {
  const router = useRouter();

  return (
    <>
      <div className={classNames("header-place-holder", {
        opened: sideBarIsOpened,
      })}
      />

      <div className={classNames("header-layout", {
        opened: sideBarIsOpened,
      })}
      >
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
            <div className="logout" onClick={() => AUTH_SERVICE.logout()}>
              <i className="icon icon-exit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
