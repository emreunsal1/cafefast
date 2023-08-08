import { Server } from "socket.io";

let io: Server;

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
    cookie: true,
  });

  io.on("connection", (socket) => {
    socket.on("join:company", (data) => {
      if (data.companyId) {
        socket.join(data.companyId);
      }
    });
  });
};

const getIO = () => io;

const groupByCompany = () => {
  // io.on("join:company", (socket, data) => {
  //   // socket.join()
  // });
};

export { createSocketServer, getIO, groupByCompany };
