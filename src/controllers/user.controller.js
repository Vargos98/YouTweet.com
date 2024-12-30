// Import the asyncHandler utility function from the "../utils/asyncHandler.js" file
// This utility is used to handle asynchronous functions and manage errors automatically
import { asyncHandler } from "../utils/asyncHandler.js";

// Define the registerUser function using asyncHandler
// asyncHandler wraps the function to catch and forward any errors to the error-handling middleware
const registerUser = asyncHandler(async (req, res) => {
  // Send a response with a status code of 200 (OK)
  // The response includes a JSON object with a message property set to "ok"
  res.status(200).json({
    message: "ok", // This message indicates a successful operation
  });
});

// Export the registerUser function so it can be imported and used in other files
// This is typically used in route definitions to handle the registration endpoint
export { registerUser };
