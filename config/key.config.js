require("dotenv").config({ path: require("find-config")(".env") });

module.exports = {
  googleKey: {
    clientId: "",
    clientSecret: "",
    callbackURL: "",
  },
};
