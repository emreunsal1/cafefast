import React from "react";

import { UserContext } from "../context/UserContext";
import { MenuContext } from "../context/MenuContext";
import { ProductContext } from "../context/ProductContext";

export default function App({ Component, pageProps }) {
  return (
    <UserContext>
      <ProductContext>
        <MenuContext>
          <Component {...pageProps} />
        </MenuContext>
      </ProductContext>
    </UserContext>
  );
}
