import { useRouter } from "next/router";
import React, { useState } from "react";

export default function MenuBar() {
  const [menuItem, setMenuItem] = useState([{ key: "Profile", route: "/profile" }]);
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
