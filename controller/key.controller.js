const key = require("../model/key.model");
const crypto = require("crypto");
const User = require("../model/user.model");

module.exports = {
  createKey: async (req, res) => {
    try {
      const user = req.user;
      console.log(user);
      const accType = user.accountType || {};
      let accountType;
      if (accType.isFree) accountType = "isFree";
      else if (accType.isPaid) accountType = "isPaid";
      else {
        return res
          .status(409)
          .json({ message: "account type is not specified" });
      }
      console.log(accountType);
      const hashId = crypto
        .createHash("sha256")
        .update(user.id)
        .digest("hex")
        .slice(0, 20);
      const apiKey = `BCP-${hashId}-${accountType}`;
      const keyDate = await key.findOneAndUpdate(
        { UserId: user.id },
        {
          Value: apiKey,
          KeyType: {
            isFree: accountType === "isFree",
            isPaid: accountType === "isPaid",
          },
          UserId: user.id,
        },
        { upsert: true, new: true }
      );
      await User.findByIdAndUpdate(user.id, {
        KeyId: keyDate._id,
      });

      res.status(201).json({
        success: true,
        message: "Key created successfully",
        key: keyDate.Value,
        accountType,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || "internal key server error" });
    }
  },
};
