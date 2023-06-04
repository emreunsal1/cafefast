import React from "react";
import { useRouter } from "next/router";
import AUTH_SERVICE from "@/services/auth";
import USER_SERVICE from "@/services/user";

export default function Layout({ children }) {
  const router = useRouter();
  const logout = async () => {
    await AUTH_SERVICE.logout();
    router.push("/auth/login");
  };
  return (
    <div id="layout">
      <div className="header" onClick={logout}>
        Logout
      </div>
      <main>{children}</main>
    </div>
  );
}
