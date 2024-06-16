require('dotenv').config();

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