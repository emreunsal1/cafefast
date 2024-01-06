import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import AUTH_SERVICE from "@/services/auth";
import Icon from "./library/Icon";

// TODO: Buradaki localstorage transition problemini çöz.
export default function SideBar({ isOpened }) {
  const router = useRouter();

  const MenuItems = [
    { key: "Anasayfa", route: "/", icon: "home" },
    { key: "Menüler", route: "/menu", icon: "menu" },
    { key: "Ürünler", route: "/product", icon: "product" },
    { key: "Mutfak", route: "/kitchen", icon: "kitchen" },
    { key: "Masalar", route: "/table", icon: "qr-icon" },
    { key: "Kampanyalar", route: "/campaigns", icon: "campain" },
  ];

  const placeholderClassname = classNames("sidebar-placeholder", { closed: !isOpened });
  const sidebarClassname = classNames("side-bar", { closed: !isOpened });

  return (
    <>
      <div className={placeholderClassname} />
      <div id="Menu" className={sidebarClassname}>
        <div className="container">
          <div className="header">
            <div className="company-place">
              {isOpened ? "CAFE FAST" : "CF" }
            </div>
          </div>
          <div className="list">
            {
          MenuItems.map((item, index) => (
            <div
              className={classNames("menu-item", { selected: router.pathname.includes(item.route) })}
              key={index}
              onClick={() => {
                if (item.clicked) {
                  item.clicked.call();
                }
                router.push(item.route);
              }}
            >
              <div className="icon-wrapper">
                <Icon name={item.icon} />
              </div>
              {isOpened && (
              <div className="title">
                {item.key}
              </div>
              )}
            </div>
          ))
      }
          </div>
        </div>
      </div>
    </>

  );
}
