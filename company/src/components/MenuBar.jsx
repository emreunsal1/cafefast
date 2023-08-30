import { useRouter } from "next/router";
import React from "react";

const MenuItems = [
  { key: "Profile", route: "/profile" },
  { key: "Menus", route: "/menus" },
  { key: "Products", route: "/products" },
  { key: "Kitchen", route: "/kitchen" },
  { key: "Table", route: "/table" },
  { key: "Campain", route: "/campaings" },
];

export default function MenuBar() {
  const router = useRouter();
  return (
    <div id="Menu">
      <div className="container">
        {
          MenuItems.map((item, index) => (
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
