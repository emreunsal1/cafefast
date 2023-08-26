import React from "react";
import { MenuContext } from "../context/MenuContext";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";
import { SocketContext } from "../context/SocketContext";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(

    <GlobalMessageContext>
      <SocketContext>
        <ProductContext>
          <MenuContext>
            <Component {...pageProps} />
          </MenuContext>
        </ProductContext>
      </SocketContext>
    </GlobalMessageContext>,

  );
}
