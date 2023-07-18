import React from "react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  const basketClickHandler = async () => {
    router.push("/basket");
  };

  return (
    <div id="layout">
      <div className="header" onClick={basketClickHandler}>
        Basket
      </div>
      <main>{children}</main>
    </div>
  );
}
