import React, { createContext, useContext } from "react";
import moment from "moment";
import "moment/locale/tr";

moment.locale("tr");

const Context = createContext({ formatDate: moment, moment });

export function DateContext({ children }) {
  const formatDate = (date, format = "LLL") => moment(date).format(format);
  return (
    <Context.Provider value={{ formatDate, moment }}>
      {children}
    </Context.Provider>
  );
}

export const useDate = () => useContext(Context);
