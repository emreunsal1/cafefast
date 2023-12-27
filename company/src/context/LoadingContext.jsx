import React, { createContext, useContext, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import loadingSvg from "../public/loading.svg";

const Context = createContext({ loading: false, setLoading: () => {} });

export function GlobalLoadingContext({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <Context.Provider value={{ loading, setLoading }}>
      <AnimatePresence>
        {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 1.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.7 }}
          className="global-loading"
        >
          <Image src={loadingSvg} width="100" height="100" />
        </motion.div>
        )}
      </AnimatePresence>
      {children}
    </Context.Provider>
  );
}

export const useLoading = () => useContext(Context);
