const  passport  = require('../controllers/auth/googleAuthController');
const handleGoogleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    req.logIn(user, (err) => {
      if (err) return next(err);
      if (req.user.toRegister) {
        return res.json(req.user);
      } else {
        req.body.id = req.user.foundUser._id;
        req.body.userOrMail = req.user.email;
        next();
      }
    });
  })(req, res, next);
};

module.exports = handleGoogleCallback;
