const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    default: "",
  },
  UserEmail: {
    type: String,
    default: "",
  },
  AccountType: {
    isFree: {
      type: Boolean,
      default: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  TotalRequest: {
    type: Number,
    default: 30,
  },
  RequestRemaining: {
    type: Number,
  },
  KeyId: {
    type: mongoose.Schema.ObjectId,
    ref: "keys",
  },
  AuthProvider: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("users", UserSchema);
