import React from "react";
import { MenuContext } from "../context/Menu";

export default function App({ Component, pageProps }) {
  return (
    <MenuContext>
      <Component {...pageProps} />
    </MenuContext>
  );
}
