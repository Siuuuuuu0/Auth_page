require('dotenv').config();
const verifyJWT = require('./middleware/verifyJWT'); 
const {logger} = require('./middleware/logEvents'); 
const errorHandler = require('./middleware/errorHandler'); 
const credentials = require('./middleware/credentials'); 
const corsOptions = require('./config/corsOptions'); 
const connectToDB = require('./config/dbConnection'); 
const cookieParser = require('cookie-parser'); 
const path = require('path'); 
const cors = require('cors'); 
const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose'); 

const PORT = process.env.PORT||3500;

connectToDB(); 

app.use(logger); 
app.use(credentials);
app.use(cors(corsOptions)); 
app.use(express.urlencoded({extended : false}));
app.use(express.json()); 
app.use(cookieParser);
app.use(express.static(path.join(__dirname, '/public')));
app.use('/auth', require('./routes/auth')); 
app.use('/logout', require('./routes/logout')); 
app.use('/register', require('./routes/register')); 
app.use('/refresh', require('./routes/refresh')); 
app.use(verifyJWT); 
// app.use('/', require('./routes/root')); //after auth
//user.js here

app.all('./*', (req, res)=>{
    res.status(404); 
    if(req.accepts('html')){
        res.sendFile(paht.join(__dirname, 'views', '404.html')); 
    }
    else if(req.accepts('json')){
        res.json({error : '404 not found'});
    }
    else{
        res.type('txt').send('404 not found'); 
    }
});
app.use(errorHandler); 
mongoose.connection.once('open', ()=>{
    console.log('Connected to Mongo'); 
    app.listen(PORT, ()=>console.log(`Running on port ${PORT}`));
})
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