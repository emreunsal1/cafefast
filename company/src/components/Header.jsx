import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import classNames from "classnames";
import AUTH_SERVICE from "@/services/auth";
import cafeFastIcon from "../public/images/cafeFastIcon.png";
import Icon from "./library/Icon";
import Dropdown from "./library/Dropdown";

export default function Header({ sideBarButtonClickHandler, sideBarIsOpened }) {
  const router = useRouter();

  const myProfileItem = (
    <div className="header-dropdown-item" onClick={() => router.push("/profile")}>
      <Icon name="profile" />
      Profilim
    </div>
  );
  const logoutItem = (
    <div className="header-dropdown-item logout" onClick={() => AUTH_SERVICE.logout()}>
      <Icon name="exit" />
      Çıkış
    </div>
  );
  const dropdownItems = [myProfileItem, logoutItem];

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
              <motion.div animate={{ transform: sideBarIsOpened ? "rotate(180deg)" : "rotate(0deg)" }}>
                <Icon name="right-chevron" />
                <Icon name="right-chevron" />
                <Icon name="right-chevron" />
              </motion.div>
            </div>
          </div>
          <div className="header-center">
            <div className="header-company-icon-wrapper" onClick={() => router.push("/")}>
              <Image src={cafeFastIcon} alt="cafefast-icon" />
            </div>
          </div>
          <div className="header-right">
            <Dropdown
              menuPosition="righttoleft"
              buttonContent={<Icon name="profile" />}
              items={dropdownItems}
            />
          </div>
        </div>
      </div>
    </>
  );
}
