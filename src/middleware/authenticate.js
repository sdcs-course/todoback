const passport = require('passport');
const { logger } = require('../utils/logger');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      logger.error('Authentication error:', err);
      return res.status(500).json({ message: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    req.user = user;
    next();
  })(req, res, next);
}; 