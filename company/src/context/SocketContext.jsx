import React, {
  createContext, useContext, useEffect, useState,
} from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { API_URl, LOCAL_COMPANY_ID_KEY } from "@/constants";

const Context = createContext({});

export function SocketContext({ children }) {
  const [socket, setSocket] = useState(null);
  const unsafeRoutes = ["/auth/login", "/auth/register", "/auth/onboarding"];

  const router = useRouter();

  const connectSocket = () => {
    const isInUnsafeRoute = unsafeRoutes.some((route) => route === router.asPath);
    if (isInUnsafeRoute) {
      return;
    }
    const companyId = localStorage.getItem(LOCAL_COMPANY_ID_KEY);
    const socketInstance = io(API_URl);
    setSocket(socketInstance);
    socketInstance.emit("join:company", { companyId });
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
