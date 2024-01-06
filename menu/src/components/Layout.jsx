import React from "react";
import { useRouter } from "next/router";
import NavigationBar from "./NavigationBar";

export default function Layout({ children }) {
  const router = useRouter();

  const basketClickHandler = async () => {
    router.push(`/${router.query.companyId}/basket`);
  };

  return (
    <div id="layout">
      <div className="header" onClick={basketClickHandler}>
        Basket
      </div>
      <main>{children}</main>
      <NavigationBar />
    </div>
  );
}
