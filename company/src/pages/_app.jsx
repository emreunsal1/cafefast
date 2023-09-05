import React from "react";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";
import { SocketContext } from "../context/SocketContext";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(

    <GlobalMessageContext>
      <SocketContext>
        <ProductContext>
          <Component {...pageProps} />
        </ProductContext>
      </SocketContext>
    </GlobalMessageContext>,

  );
}
