const  passport  = require('../controllers/googleAuthController');
const handleGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/testing');
    req.logIn(user, (err) => {
      if (err) return next(err);
      if (req.user.toRegister) {
        res.redirect('/register/confirm-registration');
      } else {
        next();
      }
    });
  })(req, res, next);
};

module.exports = handleGoogleCallback;
