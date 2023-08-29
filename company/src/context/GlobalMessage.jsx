import React, { createContext, useContext } from "react";
import { message } from "antd";

const Context = createContext({});

export function GlobalMessageContext({ children }) {
  const [messageApi, contextHolder] = message.useMessage();

  const sendMessage = (type, messageText) => {
    messageApi.open({
      type,
      content: messageText,
    });
  };
  return (
    <Context.Provider value={sendMessage}>
      {contextHolder}
      {children}
    </Context.Provider>
  );
}

export const useMessage = () => useContext(Context);
