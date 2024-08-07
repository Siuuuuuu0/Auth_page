require('dotenv').config();
const express = require('express');
// const session = require('express-session');
const app = express(); 
const verifyJWT = require('./middleware/verifyJWT'); 
const { logger } = require('./middleware/logEvents'); 
const errorHandler = require('./middleware/errorHandler'); 
// const sessionTTL = require('./middleware/sessionTTL');
const credentials = require('./config/credentials'); 
const corsOptions = require('./config/corsOptions'); 
const connectToDB = require('./config/dbConnection'); 
const {loginLimiter} = require('./config/rateLimiter');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
const cors = require('cors');  
const mongoose = require('mongoose'); 
const multer = require('multer')
const storage = multer.memoryStorage() // Store files in memory instead of on disk
const upload = multer({ storage: storage })
// const helmet = require('helmet');
// const passport = require('./controllers/auth/googleAuthController'); 

const PORT = process.env.PORT || 3500;
// Connect to DB
connectToDB(); 
//write a readme with all the policies implemented, write that thought about mixed approch for sessions and jwts but decided not to + why

// Middleware
// app.use(logger); 
// app.use(helmet()); //hsts and other headers 
app.use(credentials);
app.use(cors(corsOptions)); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
// app.use(session({
//     secret : 'dog',
//     resave : false, 
//     saveUninitialized : true, 
//     cookie : {secure : false} 
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(sessionTTL);

// Routes
app.use('/testing', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', '404.html'));
}); 
app.use('/success', require('./routes/root'));
app.use('/auth', loginLimiter, require('./routes/apis/auth/auth')); 
app.use('/reset', require('./routes/apis/account/reset'));

// Protected routes
app.use(verifyJWT); 
app.use('/update', require('./routes/apis/account/update'));
app.use('/users', require('./routes/apis/users/users')); 
app.use('/root', require('./routes/root'));
app.use('/account', upload.single('profilePicture'), require('./routes/apis/account/account'));

// 404 Handler
app.all('/*', (req, res) => {
    res.status(404); 
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html')); 
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' });
    } else {
        res.type('txt').send('404 not found'); 
    }
});

// Error Handler
app.use(errorHandler); 

// Start Server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB'); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// 200 OK
// Meaning: The request has succeeded. The meaning of success depends on the HTTP method (GET: resource retrieved, POST: resource created).
// 2. 201 Created
// Meaning: The request has been fulfilled and has resulted in one or more new resources being created.
// 3. 204 No Content
// Meaning: The server successfully processed the request, but is not returning any content. This is often used for DELETE requests.
// 4. 301 Moved Permanently
// Meaning: This and all future requests should be directed to the given URI.
// 5. 302 Found (Previously "Moved Temporarily")
// Meaning: Tells the client to look at (browse to) another URL. This is typically used for temporary redirects.
// 6. 400 Bad Request
// Meaning: The server cannot or will not process the request due to a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
// 7. 401 Unauthorized
// Meaning: The request requires user authentication. The client must authenticate itself to get the requested response.
// 8. 403 Forbidden
// Meaning: The server understood the request, but refuses to authorize it. This status is similar to 401, but in this case, re-authenticating will make no difference.
// 9. 404 Not Found
// Meaning: The server can't find the requested resource. In the browser, this means the URL is not recognized.
// 10. 500 Internal Server Error
// Meaning: The server encountered an unexpected condition that prevented it from fulfilling the request.