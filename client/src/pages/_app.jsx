import React from "react";

import { UserContext } from "../context/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <UserContext>
      <Component {...pageProps} />
    </UserContext>
  );
}
