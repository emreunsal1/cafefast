import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import AUTH_SERVICE from "@/services/auth";
import { STORAGE } from "@/utils/browserStorage";

// TODO: Buradaki localstorage transition problemini çöz.
export default function SideBar() {
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(false);

  const MenuItems = [
    { key: "Anasayfa", route: "/", icon: "home" },
    { key: "Profile", route: "/profile", icon: "profile" },
    { key: "Menu", route: "/menu", icon: "menu" },
    { key: "Products", route: "/product", icon: "product" },
    { key: "Kitchen", route: "/kitchen", icon: "kitchen" },
    { key: "Table", route: "/table", icon: "qr-icon" },
    { key: "Campain", route: "/campaings", icon: "campain" },
    {
      key: "Logout", route: "/auth/login", clicked: AUTH_SERVICE.logout, icon: "exit",
    },
  ];

  const openHandler = () => {
    STORAGE.setLocal("sideMenuOpened", !isOpened);
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    setIsOpened(STORAGE.getLocal("sideMenuOpened") === "true");
  }, []);

  const placeholderClassname = classNames("sidebar-placeholder", { closed: !isOpened });
  const sidebarClassname = classNames("side-bar", { closed: !isOpened });

  return (
    <>
      <div className={placeholderClassname} />
      <div id="Menu" className={sidebarClassname}>
        <div className="container">
          <div className="header">
            <div className="company-place">
              {isOpened ? "CAFE FAST" : "C" }
            </div>
            <div className="opened-button" onClick={openHandler}>
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