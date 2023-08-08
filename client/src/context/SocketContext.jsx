import React, {
  createContext, useContext, useEffect, useRef, useState,
} from "react";
import { io } from "socket.io-client";

const Context = createContext({});

export function SocketContext({ children }) {
  const socket = useRef(null);
  const connectSocket = () => {
    socket.current = io("http://localhost:4000/");
    socket.current.on("connect", () => {
      console.log("connected socket");
    });
    socket.current.emit("join:company", {
      companyId: "64208d2c890cdcf8376c87a5",
    });
  };
  useEffect(() => {
    connectSocket();
  }, []);

  const listener = (key, func) => {
    socket.current?.on(key, func);
  };

  const emitter = (key, data) => {
    socket.current.emit(key, data);
  };
  return (
    <Context.Provider value={{
      listener, emitter,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useSocket = () => useContext(Context);
