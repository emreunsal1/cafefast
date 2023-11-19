import React from "react";
import { useRouter } from "next/router";
import AUTH_SERVICE from "@/services/auth";
import USER_SERVICE from "@/services/user";
import SideBar from "./SideBar";

export default function Layout({ children }) {
  const router = useRouter();
  const logout = async () => {
    await AUTH_SERVICE.logout();
    router.push("/auth/login");
  };
  return (
    <div id="layout">
      <SideBar />
      <main>{children}</main>
    </div>
  );
}
