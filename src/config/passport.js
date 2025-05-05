const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const { logger } = require('../utils/logger');

// Проверка наличия необходимых переменных окружения
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials in environment variables');
  process.exit(1);
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Поиск существующего пользователя
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Создание нового пользователя
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });
        logger.info(`New user created: ${user.email}`);
      }
      
      return done(null, user);
    } catch (error) {
      logger.error('Error in Google strategy:', error);
      return done(error, null);
    }
  }
));

// JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      logger.error('Error in JWT strategy:', error);
      return done(error, false);
    }
  }
));

module.exports = passport; 