// Import the ApiError utility for handling custom API errors
import { ApiError } from "../utils/ApiError.js";

// Import the asyncHandler utility for managing asynchronous operations and errors
import { asyncHandler } from "../utils/asyncHandler.js";

// Import the jwt library for JSON Web Token operations like verification
import jwt from "jsonwebtoken";

// Import the User model to interact with the user collection in the database
import { User } from "../models/user.model.js";



// Define the verifyJwt middleware function and wrap it with asyncHandler
// This middleware verifies the validity of a JWT token and ensures the user is authenticated
export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    // Step 1: Retrieve the token from cookies or the Authorization header
    // If using the Authorization header, remove the "Bearer" prefix
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

    // Step 2: If no token is provided, throw an Unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    // Step 3: Verify the token using the secret key stored in environment variables
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Step 4: Find the user in the database using the decoded token's user ID
    // Exclude sensitive fields like password and refreshToken from the result
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    // Step 5: If the user is not found or the token is invalid, throw an Unauthorized error
    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }

    // Step 6: Attach the authenticated user object to the request for downstream use
    req.user = user;

    // Step 7: Call the next middleware function to proceed with the request
    next();
  } catch (error) {
    // Step 8: If any error occurs, throw an Unauthorized error with the error message
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
