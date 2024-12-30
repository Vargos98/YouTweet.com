// Import the asyncHandler utility to manage asynchronous operations and handle errors
import { asyncHandler } from "../utils/asyncHandler.js";

// Import the ApiError class to throw custom API error messages
import { ApiError } from "../utils/ApiError.js";

// Import the User model to interact with the user database collection
import { User } from "../models/user.model.js";

// Import the function to upload files to Cloudinary for storing images
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Import the ApiResponse utility to format API responses consistently
import { ApiResponse } from "../utils/ApiResponse.js";

// Utility function to generate access and refresh tokens for a user
const generateAcessAndRefereshTokens = async (userId) => {
  try {
    // Fetch the user by ID
    const user = await User.findById(userId);

    // Generate access and refresh tokens using methods from the user model
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token to the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Throw a server error if token generation fails
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};

// Define the registerUser function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
  // Step 1: Extract user details from the request body
  const { fullName, email, username, password } = req.body;

  // Step 2: Check if any fields are missing or empty
  if ([fullName, email, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, 'All fields are required');
  }

  // Step 3: Check if a user already exists with the given email or username
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  // Step 4: If the user exists, throw a conflict error
  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  // Step 5: Extract avatar and cover image file paths if provided
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files?.coverImage?.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // Step 6: Ensure the avatar is provided; throw an error if not
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // Step 7: Upload the avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // Step 8: Upload the cover image to Cloudinary if provided
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Step 9: Create a new user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Step 10: Fetch the created user and exclude sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  // Step 11: If user creation fails, throw a server error
  if (!createdUser) {
    throw new ApiError(500, 'Failed to create user');
  }

  // Step 12: Return the created user in the response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

// Define the loginUser function to handle user login
const loginUser = asyncHandler(async (req, res) => {
  // Step 1: Extract login credentials from the request body
  const { email, username, password } = req.body;

  // Step 2: Check if username or email is provided
  if (!username || !email) {
    throw new ApiError(400, 'Username or email is required');
  }

  // Step 3: Find the user in the database by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  // Step 4: If the user does not exist, throw a not found error
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  // Step 5: Validate the provided password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  // Step 6: Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAcessAndRefereshTokens(user._id);

  // Step 7: Fetch the logged-in user and exclude sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refresh-token");

  // Step 8: Define options for setting secure cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Step 9: Set cookies and return a success response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Logged in successfully"
      )
    );
});

// Define the logoutUser function to handle user logout
const logoutUser = asyncHandler(async (req, res) => {
  // Step 1: Remove the refresh token from the user's database entry
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  // Step 2: Define options for clearing cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Step 3: Clear the cookies and return a success response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Export the registerUser, loginUser, and logoutUser functions
export { registerUser, loginUser, logoutUser };
