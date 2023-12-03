import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line no-unused-vars
const emptyFunc = (_message = "") => {};
const Context = createContext({
  info: emptyFunc,
  success: emptyFunc,
  error: emptyFunc,
  warning: emptyFunc,
});

export function GlobalMessageContext({ children }) {
  const sendMessage = (type, messageText) => {
    toast(messageText, {
      type,
      autoClose: 1500,
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
