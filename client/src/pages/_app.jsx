import React from "react";
import { UserContext } from "../context/UserContext";
import { MenuContext } from "../context/MenuContext";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";
import { SocketContext } from "../context/SocketContext";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <SocketContext>
      <GlobalMessageContext>
        <UserContext>
          <ProductContext>
            <MenuContext>
              <Component {...pageProps} />
            </MenuContext>
          </ProductContext>
        </UserContext>
      </GlobalMessageContext>
    </SocketContext>,
  );
}
