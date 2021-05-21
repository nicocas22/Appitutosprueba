const Chats = require("./models/Chats");
const { v4: uuidV4 } = require("uuid");
const Messages = require("./models/Messages");

const addUser = ({ recieverId, senderId }, socket) => {
  if (!recieverId || !senderId) return { error: "You tried to add zero uses" };

  const user = { recieverId, senderId };

  //   if there is a recieverEmail of same and my email is the senderEmail
  Chats.aggregate([
    {
      $match: {
        recieverId,
        senderId,
      },
    },
  ]).then((chat) => {
    console.log("uno");
    if (chat.length > 0) {
      socket.emit("openChat", { ...chat[0] });
    } else {
      console.log("dos");
      Chats.aggregate([
        {
          $match: {
            recieverId: senderId,
            senderId: recieverId,
          },
        },
      ]).then((lastAttempt) => {
        console.log("tres");
        if (lastAttempt.length > 0) {
          socket.emit("openChat", { ...lastAttempt[0] });
        } else {
          const newChat = {
            ...user,
            roomID: uuidV4(),
          };
          console.log("cuatro");
          socket.emit("openChat", newChat);
          // Create new Chat
          new Chats(newChat).save();
        }
      });
    }
  });
};

const loadMessages = (socket) => {
  socket.on("sentMsgs", ({ myId }, cb) => {
    Messages.find({ senderId: myId }).then((msgs) => {
      if (!msgs) return cb(null);
      cb(msgs);
    });
  });

  socket.on("recievedMsgs", ({ myId }, cb) => {
    Messages.find({ recieverId: myId }).then((msgs) => {
      if (!msgs) return cb(null);
      return cb(msgs);
    });
  });
};

module.exports = { addUser, loadMessages };
