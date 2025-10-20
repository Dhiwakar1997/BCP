const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/key.config");
const User = require("../model/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleKey.clientId,
      clientSecret: keys.googleKey.clientSecret,
      callbackURL: keys.googleKey.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          UserEmail: profile.emails?.[0]?.value,
        });

        if (!user) {
          user = await User.create({
            Username: profile.displayName,
            UserEmail: profile.emails?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
