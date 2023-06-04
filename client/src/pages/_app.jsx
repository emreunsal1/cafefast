import React from "react";
import { UserContext } from "../context/UserContext";
import { MenuContext } from "../context/MenuContext";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <GlobalMessageContext>
      <UserContext>
        <ProductContext>
          <MenuContext>
            <Component {...pageProps} />
          </MenuContext>
        </ProductContext>
      </UserContext>
    </GlobalMessageContext>,
  );
}
