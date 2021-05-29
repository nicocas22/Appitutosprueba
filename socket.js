const http = require("http");
const socketIo = require("socket.io");
const Chats = require("./chats/models/Chats");
const Messages = require("./chats/models/Messages");
const Usuarios = require("./Usuarios/models/usuario");
const { addUser, loadMessages } = require("./chats/misc");
const socket = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server);

  const usuarioConectado = async (_id) => {
    const usuario = await Usuarios.findById(_id);
    usuario.online = true;
    await usuario.save();
  };
  const usuarioDesconectado = async (_id) => {
    const usuario = await Usuarios.findById(_id);
    usuario.online = false;
    usuario.ultimaConexion = new Date();
    await usuario.save();
  };
  io.on("connection", function (socket) {
    console.log("conectado");
    let idusuario = socket.handshake.query.idusuario;
    if (idusuario) {
      usuarioConectado(idusuario);
    }
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
                users.push({ ...user1._doc, roomID: roomChats[i].roomID });
              }

              let user2 = await Usuarios.findById(roomChats[i].senderId);
              if (user2?._id != idUser) {
                users.push({ ...user2._doc, roomID: roomChats[i].roomID });
              }
            }
          }

          socket.emit("getAllUsers", users);
        }
      );

      loadMessages(socket);
    });
    // * Unique chat *//
    socket.on("startUniqueChat", ({ recieverId, senderId }, callback) => {
      addUser({ recieverId, senderId }, socket);
    });

    socket.on("joinTwoUsers", ({ roomID }, cb) => {
      socket.join(roomID);
      cb({ roomID });
    });

    socket.on("sendTouser", async (data) => {
      const { roomID, senderId, recieverId, time, txtMsg } = data;

      const mensaje = await new Messages({
        roomID,
        senderId,
        recieverId,
        time,
        txtMsg,
      });
      await mensaje.save();
      socket.broadcast.to(roomID).emit("dispatchMsg", mensaje);
    });

    socket.on("updateViewMsgs", async (data, cb) => {
      const mensajes = await Messages.find({
        recieverId: data.recieverId,
        roomID: data.roomID,
        visto: false,
      });
      await Messages.updateMany(
        {
          recieverId: data.recieverId,
          roomID: data.roomID,
          visto: false,
        },
        { $set: { visto: true } }
      );

      cb(mensajes);
    });
    socket.on("disconnect", async () => {
      usuarioDesconectado(idusuario);
    });
  });
 
  return server;
};

module.exports = socket;
