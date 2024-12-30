// Import the Router class from the Express framework
// This allows us to create modular route handlers for the application
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
// Import the registerUser function from the user.controller.js file
// This function is a controller responsible for handling the user registration logic
import { registerUser } from "../controllers/user.controller.js";

// Create a new router instance using the Router class
// This instance will be used to define routes related to user operations
const router = Router();

// Define a route for the "/register" endpoint
// The .route() method chains HTTP methods (e.g., .post())
// Here, a POST request to "/register" will trigger the registerUser controller function
router.route("/register").post(
  upload.fields([
    {
      name:"avatar",
      maxCount: 1,
    },{
      name:"coverImage",
      maxCount: 1,
    }
  ]),registerUser
);

// Export the router instance as the default export of this module
// This makes it available for use in other parts of the application
export default router;
