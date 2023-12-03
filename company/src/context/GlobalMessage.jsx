import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Context = createContext({});

export function GlobalMessageContext({ children }) {
  const sendMessage = (type, messageText) => {
    toast(messageText, {
      type,
    });
  };

  const info = (text) => sendMessage("info", text);
  const success = (text) => sendMessage("success", text);
  const error = (text) => sendMessage("error", text);
  const warning = (text) => sendMessage("warning", text);

  return (
    <Context.Provider value={{
      info, success, error, warning,
    }}
    >
      <ToastContainer />
      {children}
    </Context.Provider>
  );
}

export const useMessage = () => useContext(Context);
