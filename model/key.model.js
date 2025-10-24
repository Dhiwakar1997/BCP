const mongoose = require("mongoose");

const KeySchema = new mongoose.Schema({
  KeyType: {
    isFree: {
      type: Boolean,
      default: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  Value: {
    type: String,
  },
});

module.exports = mongoose.model("keys", KeySchema);
