import express from 'express'; // Importing the Express framework
import cors from 'cors'; // Importing CORS middleware for cross-origin requests
import cookieParser from 'cookie-parser'; // Importing middleware to parse cookies

const app = express(); // Initializing the Express application

// Enabling CORS to allow requests from a specified origin and include credentials (e.g., cookies)
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allows requests only from the specified origin in the environment variable
  credentials: true, // Enables sending cookies and authentication headers with requests
}));

// Middleware to parse incoming JSON requests
// Limits the request body size to 16 KB for security purposes
app.use(express.json({ limit: "16kb" })); 

// Middleware to parse URL-encoded data (form submissions)
// `extended: true` allows parsing nested objects, and the limit is set to 16 KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files from the "public" directory
// For example, files like images or HTML in the "public" folder will be accessible
app.use(express.static("public"));

// Middleware to parse cookies in the incoming requests
// Allows access to cookies as `req.cookies` in route handlers
app.use(cookieParser()); 

export { app }; // Exporting the `app` instance for use in other modules
