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
  api_key_hash:{
    type: String,
  },
  expires_at: {
    type: mongoose.Schema.Types.Date,
  },
  last_used:{
    type: mongoose.Schema.Types.Date,
  },
  created_at:{
    type: mongoose.Schema.Types.Date,
  },
  is_revoked:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("keys", KeySchema);
