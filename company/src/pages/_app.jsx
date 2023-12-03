import React from "react";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";
import { SocketContext } from "../context/SocketContext";
import { DateContext } from "../context/DateContext";
import "../style/index.scss";
import { getLayout as _getLayout } from "../utils/layout";
import { GlobalLoadingContext } from "@/context/LoadingContext";

export default function App({ Component, pageProps }) {
  Component.getLayout = _getLayout();
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <DateContext>
      <GlobalLoadingContext>
        <GlobalMessageContext>
          <SocketContext>
            <ProductContext>
              <Component {...pageProps} />
            </ProductContext>
          </SocketContext>
        </GlobalMessageContext>
      </GlobalLoadingContext>
    </DateContext>,
  );
}
