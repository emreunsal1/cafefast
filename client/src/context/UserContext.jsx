import React, { createContext, useContext } from "react";

const Context = createContext();

const value = {
  state: {},
  setState: {},
  methods: {},
};

export function UserContext({ children }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useUser = () => useContext(Context);
