import { Server } from "socket.io";
import logger from "./logger";

let io: Server;

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
    cookie: true,
  });
  logger.info("Socket server created");

  io.on("connection", (socket) => {
    socket.on("join:company", (data) => {
      if (data.companyId) {
        socket.join(data.companyId);
      }
    });
  });
};

const getIO = () => io;

export { createSocketServer, getIO };
