// Import the Router class from the Express framework
// This provides a modular way to define route handlers in the application
import { Router } from "express";

// Import the upload middleware for handling file uploads
// This middleware is used to handle multipart/form-data, particularly for file uploads
import { upload } from "../middlewares/multer.middleware.js";

// Import controller functions for user-related operations
// These include registerUser, loginUser, and logoutUser
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

// Import the verifyJwt middleware to authenticate protected routes
// This ensures that only authorized users can access certain endpoints
import { verifyJwt } from "../middlewares/auth.middleware.js";

// Create a new instance of the Express Router
// This instance will manage user-related routes
const router = Router();

// Define a POST route for the "/register" endpoint
// This route handles user registration with file uploads for avatar and cover image
router.route("/register").post(
  upload.fields([
    {
      name: "avatar", // Field name for the avatar file
      maxCount: 1,    // Limit the number of uploaded files for this field to 1
    },
    {
      name: "coverImage", // Field name for the cover image file
      maxCount: 1,        // Limit the number of uploaded files for this field to 1
    },
  ]),
  registerUser // Controller function to handle registration logic
);

// Define a POST route for the "/login" endpoint
// This route handles user login by invoking the loginUser controller function
router.route("/login").post(loginUser);

// Define a POST route for the "/logout" endpoint
// This route is protected with the verifyJwt middleware and handles user logout
router.route("/logout").post(verifyJwt, logoutUser);

// Export the router instance as the default export of this module
// This allows the router to be used in the main application or other modules
export default router;
