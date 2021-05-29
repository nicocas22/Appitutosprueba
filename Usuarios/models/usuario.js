const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  roomID: { type: String, required: true },
  senderId: { type: String, required: true },
  recieverId: { type: String, required: true },
  txtMsg: { type: String, required: true },
  visto: { type: Boolean, default: false },
  time: { type: String, default: Date.now },
  create: { type: Date, default: Date.now },
});

module.exports = Messages = mongoose.model("messages", MessagesSchema);
