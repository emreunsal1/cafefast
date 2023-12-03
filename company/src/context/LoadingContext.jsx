import React, { createContext, useContext, useState } from "react";
import Image from "next/image";
import loadingSvg from "../public/loading.svg";

const Context = createContext(() => {});

export function GlobalLoadingContext({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <Context.Provider value={setLoading}>
      {loading && <div className="global-loading"><Image src={loadingSvg} width="100" height="100" /></div>}
      {children}
    </Context.Provider>
  );
}

export const useLoading = () => useContext(Context);
