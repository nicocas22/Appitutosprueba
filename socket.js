const http = require("http");
const socketIo = require("socket.io");
const Chats = require("./chats/models/Chats");
const Messages = require("./chats/models/Messages");
const Usuarios = require("./Usuarios/models/usuario");
const { addUser, loadMessages } = require("./chats/misc");
const socket = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", function (socket) {
    socket.on("getUsers", (idUser) => {
      Chats.find(
        { $or: [{ recieverId: idUser }, { senderId: idUser }] },
        async (err, roomChats) => {
          if (err) return;
          let users = [];
          if (roomChats[0]) {
            for (let i = 0; i < roomChats.length; i++) {
              let user1 = await Usuarios.findById(roomChats[i].recieverId);
              if (user1?._id != idUser) {
                users.push(user1);
              }

              let user2 = await Usuarios.findById(roomChats[i].senderId);
              if (user2?._id != idUser) {
                users.push(user2);
              }
            }
          }
          io.emit("getAllUsers", users);
        }
      );

      loadMessages(socket);

      // * Unique chat *//
      socket.on("startUniqueChat", ({ recieverId, senderId }, callback) => {
        addUser({ recieverId, senderId }, socket);
      });

      socket.on("joinTwoUsers", ({ roomID }, cb) => {
        socket.join(roomID);
        cb({ roomID });
      });

      socket.on("sendTouser", async (data) => {
        socket.broadcast.to(data.roomID).emit("dispatchMsg", { ...data });
        const { roomID, senderId, recieverId, time, txtMsg } = data;
        console.log("guardando mensaje");
        const mensaje = await new Messages({
          roomID,
          senderId,
          recieverId,
          time,
          txtMsg,
        });
        mensaje.save();
      });
    });
  });

  return server;
};

module.exports = socket;
