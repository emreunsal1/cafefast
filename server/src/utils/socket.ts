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
    console.log("socket :>> ", socket.handshake.headers);
  });
};

const getIO = () => io;

const groupByCompany = () => {
  // io.on("join:company", (socket, data) => {
  //   // socket.join()
  // });
};

export { createSocketServer, getIO, groupByCompany };
