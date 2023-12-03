import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ProductContext } from "../context/ProductContext";
import { GlobalMessageContext } from "../context/GlobalMessage";
import { SocketContext } from "../context/SocketContext";
import { DateContext } from "../context/DateContext";
import "../style/index.scss";
import { getLayout as _getLayout } from "../utils/layout";
import { GlobalLoadingContext } from "@/context/LoadingContext";
import { PAGE_TITLES } from "@/constants";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  Component.getLayout = _getLayout();
  const getLayout = Component.getLayout || ((page) => page);

  const findPageTitle = () => {
    const currentRoute = router.route;
    if (currentRoute === "/") {
      return "Yönetim Paneli | Anasayfa";
    }
    const mainRoute = currentRoute.split("/")[1];
    return PAGE_TITLES[mainRoute] || "Yönetim Paneli";
  };

  return getLayout(
    <DateContext>
      <Head>
        <title>{findPageTitle()}</title>
      </Head>
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
