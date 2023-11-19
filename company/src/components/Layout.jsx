import React from "react";
import SideBar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div id="layout">
      <SideBar />
      <main>{children}</main>
    </div>
  );
}
