const {logEvents} = require('./logEvents');
const setAccessTokenCookie = (req, res, next) => {
    if(req.user && req.user.toRegister) return next();
    else if (req.user && req.user.access_Token) {
      const accessToken = req.user.access_Token;
      // logEvents(JSON.stringify(accessToken), 'testing.txt');
      res.cookie('jwt', accessToken, { httpOnly: true, sameSite: "None", maxAge: 1000 * 60 * 60 * 24 });
      logEvents(JSON.stringify(next), 'testingNext.txt');
      return res.json({accessToken});
      // res.cookie('jwt', accessToken, { httpOnly: true, secure : true, sameSite: "None", maxAge: 1000 * 60 * 60 * 24 });
    }
    else return next();
  };

module.exports = setAccessTokenCookie;