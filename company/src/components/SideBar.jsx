import React, { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import AUTH_SERVICE from "@/services/auth";

export default function SideBar() {
  const router = useRouter();
  const logout = async () => {
    await AUTH_SERVICE.logout();
  };
  const [isOpened, setIsOpened] = useState(true);

  const MenuItems = [
    { key: "Anasayfa", route: "/", icon: "home" },
    { key: "Profile", route: "/profile", icon: "profile" },
    { key: "Menu", route: "/menu", icon: "menu" },
    { key: "Products", route: "/product", icon: "product" },
    { key: "Kitchen", route: "/kitchen", icon: "kitchen" },
    { key: "Table", route: "/table", icon: "qr-icon" },
    { key: "Campain", route: "/campaings", icon: "campain" },
    {
      key: "Logout", route: "/auth/login", clicked: logout, icon: "exit",
    },
  ];

  return (
    <>
      <div className={`sidebar-placeholder ${isOpened ? "" : "closed"}`} />
      <div id="Menu" className={`side-bar ${isOpened ? "" : "closed"}`}>
        <div className="container">
          <div className="header">
            <div className="comapny-place">
              {isOpened ? "CAFE FAST" : "CF" }
            </div>
            <div className="opened-button" onClick={() => setIsOpened(!isOpened)}>
              <i className="icon icon-sidemenu" />
            </div>
          </div>
          <div className="list">
            {
          MenuItems.map((item, index) => (
            <div
              className={classNames("menu-item", { selected: router.pathname === item.route })}
              key={index}
              onClick={() => {
                if (item.clicked) {
                  item.clicked.call();
                }
                router.push(item.route);
              }}
            >
              <div className="icon-wrapper">
                <i className={`icon icon-${item.icon}`} />
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
