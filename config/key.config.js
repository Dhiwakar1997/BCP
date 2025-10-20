require("dotenv").config({ path: require("find-config")(".env") });

module.exports = {
  googleKey: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
  },
  JwtSecret: process.env.secret,
};
