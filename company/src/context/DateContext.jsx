import React, { createContext, useContext } from "react";
import moment from "moment";
import "moment/locale/tr";

moment.locale("tr");

const Context = createContext({});

export function DateContext({ children }) {
  const formatDate = (date, format = "LLL") => moment(date).format(format);
  return (
    <Context.Provider value={{ formatDate }}>
      {children}
    </Context.Provider>
  );
}

export const useDate = () => useContext(Context);
