import React from "react";
import { MenuContext } from "../context/Menu";
import { BasketContext } from "../context/Basket";
import "../styles/index.scss";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <MenuContext>
      <BasketContext>
        <Component {...pageProps} />
      </BasketContext>
    </MenuContext>,
  );
}
