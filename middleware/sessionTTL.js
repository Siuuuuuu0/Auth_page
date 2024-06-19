const session = require('express-session');
const MongoStore = require('connect-mongo');
const sessionTTL =session({
    secret : process.env.SESSION_TOKEN_SECRET, 
    resave : false, 
    saveUninitialized : false, 
    cookie : {
        // secure : true, 
        sameSite : 'none', 
        maxAge : 1000*60*30 //30 min
    }, 
    store : MongoStore.create({
        mongoUrl : process.env.DATABASE_URI, 
        collectionName : 'sessions',
        ttl : 60*30
    })
});
module.exports = sessionTTL;