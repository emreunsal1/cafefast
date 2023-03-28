import { useRouter } from "next/router";
import React from "react";

export default function MenuBar() {
  const menuItem = [{ key: "Profile", route: "/profile" }, { key: "Menu", route: "/menu" }];
  const router = useRouter();
  return (
    <div id="Menu">
      <div className="container">
        {
          menuItem.map((item, index) => (
            <div
              className="menu-item"
              key={index}
              onClick={() => router.push(item.route)}
            >
              {item.key}
            </div>
          ))
      }

      </div>
    </div>
  );
}
