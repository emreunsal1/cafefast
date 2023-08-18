import React, {
  createContext, useContext, useEffect, useState,
} from "react";
import { io } from "socket.io-client";

const Context = createContext({});

export function SocketContext({ children }) {
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    const companyId = localStorage.getItem("companyId");
    const socketInstance = io("http://localhost:4000/");
    setSocket(socketInstance);
    socketInstance.on("connect", () => console.log("connected socket"));
    socketInstance.emit("join:company", {
      companyId,
    });
  };

  const listener = (key, func) => {
    socket.on(key, func);
  };

  const emitter = (key, data) => {
    socket.emit(key, data);
  };

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <Context.Provider value={{
      listener, emitter, socket,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useSocket = () => useContext(Context);
