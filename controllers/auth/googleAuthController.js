// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../model/User');
const jwt = require('jsonwebtoken');
// const { logEvents } = require('../middleware/logEvents');
const recordLogIns = require('../../utilities/recordLogIns');


// Configure Google OAuth strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   callbackURL: "/auth/google/callback",
//   passReqToCallback: true
// }, async (req, accessToken, refreshToken, profile, done) => {
// //   logEvents(JSON.stringify(profile), 'googleProfiles.txt');
  
//   try {
//     // Check if user exists with Google ID
//     console.log('arrived here')
//     let foundUser = await User.findOne({ googleId: profile.id }).exec();
    
//     if (foundUser) {
//       // User exists, generate tokens and update user data
//       const roles = Object.values(foundUser.roles);
//       const access_Token = jwt.sign(
//         {
//           "Info": {
//             "email": foundUser.email,
//             "roles": roles,
//             "username": foundUser.username
//           }
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '15m' }
//       );
//       const refresh_Token = jwt.sign(
//         { "email": foundUser.email },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: "30d" }
//       );
//       foundUser.refreshToken = refresh_Token;
//       foundUser.lastLocation = req.body.location ? req.body.location : undefined;
//       await foundUser.save();
//       recordLogIns("New log in from ", req, foundUser);
//       req.user = {foundUser, access_Token}
      
//       return done(null, req.user);
//     } else {
//       // User not found, check by email
//       foundUser = await User.findOne({ email: profile.emails[0].value }).exec();
      
//       if (foundUser) {
//         // User found by email, link Google ID and update tokens
//         const roles = Object.values(foundUser.roles);
//         const access_Token = jwt.sign(
//           {
//             "Info": {
//               "email": foundUser.email,
//               "roles": roles,
//               "username": foundUser.username
//             }
//           },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: '30s' }
//         );
//         const refresh_Token = jwt.sign(
//           { "email": foundUser.email },
//           process.env.REFRESH_TOKEN_SECRET,
//           { expiresIn: "1d" }
//         );
//         foundUser.googleId = profile.id;
//         foundUser.refreshToken = refresh_Token;
//         foundUser.lastLocation = req.body.location ? req.body.location : undefined;
//         await foundUser.save();
//         recordLogIns("New log in from ", req, foundUser);
//         req.user = {foundUser, access_Token};
        
//         return done(null, req.user);
//       } else {
//         // User needs to register, set req.toRegister flag and continue
//         req.user = { toRegister: true };
//         req.body.email = profile.emails[0].value;
//         req.body.googleId = profile.id;
        
//         return done(null, req.user);
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return done(err, null);
//   }
// }));

// // Serialize and deserialize user (required for persistent login sessions)
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });



// module.exports = passport;

const handleGoogleAuth = async (req, res) => {
  let foundUser = await User.findOne({ googleId: req.body.googleId }).exec();
  if (foundUser) {
    // User exists, generate tokens and update user data
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        "Info": {
          "email": foundUser.email,
          "roles": roles,
          "username": foundUser.username
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { "email": foundUser.email, 
        "username" : foundUser.username
       },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    foundUser.refreshToken = refreshToken;
    foundUser.lastLocation = req.body.location ? req.body.location : undefined;
    await foundUser.save();
    recordLogIns("New log in from ", req, foundUser);
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None", secure : true, maxAge: 1000 * 60 * 60 * 24 });
    const account = {
      username : foundUser.username, 
      email : foundUser.email
    }
    return res.json({ accessToken, account : account });
  } else {
    // User not found, check by email
    foundUser = await User.findOne({ email: req.body.email }).exec();

    if (foundUser) {
      // User found by email, link Google ID and update tokens
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          "Info": {
            "email": foundUser.email,
            "roles": roles,
            "username": foundUser.username
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { "email": foundUser.email, 
          "username" : foundUser.username
         },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      foundUser.googleId = req.body.googleId; // Updated to use req.body.googleId
      foundUser.refreshToken = refreshToken;
      foundUser.lastLocation = req.body.location ? req.body.location : undefined;
      await foundUser.save();
      recordLogIns("New log in from ", req, foundUser);
      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: "None", secure : true, maxAge: 1000 * 60 * 60 * 24 });
      const account = {
        username : foundUser.username, 
        email : foundUser.email
      }
      return res.json({ accessToken, account : account });
    } else {
      return res.json({ toRegister: true, email: req.body.email, googleId: req.body.googleId });
    }
  }
}; // <-- Missing closing brace added here

module.exports = handleGoogleAuth; // Ensure to export the function if needed







