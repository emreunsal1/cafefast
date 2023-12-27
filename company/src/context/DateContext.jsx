import React, { createContext, useContext } from "react";
import moment from "moment";
import "moment/locale/tr";

moment.locale("tr");

const Context = createContext({
  formatDate: moment,
  parseDate: moment,
  moment,
});

export function DateContext({ children }) {
  const formatDate = (date, format = "LLL") => moment(date).format(format);
  const parseDate = (date, format = "LLL") => moment(date, format).format(format);

  return (
    <Context.Provider value={{ formatDate, parseDate, moment }}>
      {children}
    </Context.Provider>
  );
}

export const useDate = () => useContext(Context);
