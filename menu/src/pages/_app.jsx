import React from "react";
import { useRouter } from "next/router";
import { MenuContext } from "../context/Menu";
import { BasketContext } from "../context/Basket";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  const { query } = useRouter();

  console.log("query.companyId :>> ", query.companyId);

  return getLayout(
    <MenuContext>
      <BasketContext>
        <Component {...pageProps} />
      </BasketContext>
    </MenuContext>,
  );
}
