const  passport  = require('../controllers/auth/googleAuthController');
const handleGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/testing');
    req.logIn(user, (err) => {
      if (err) return next(err);
      if (req.user.toRegister) {
        res.redirect('/register/confirm-registration');
      } else {
        req.body.id = req.user.foundUser._id;
        next();
      }
    });
  })(req, res, next);
};

module.exports = handleGoogleCallback;
