const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
  time: { type: String, default: Date.now },
  recieverId: { type: String },
  senderId: { type: String },
  roomID: { type: String, required: true },
});

module.exports = Chats = mongoose.model("chats", ChatsSchema);

const data = [
  {
    "recieverId": "6081e3ccbe208c444817819f",
    "senderId": "609431aae17da448c0dc5553",
    "roomID": "jdspcjk_ldf343489302_od09c",
  },
];
