// Import the asyncHandler utility function from the "../utils/asyncHandler.js" file
// This utility is used to handle asynchronous functions and manage errors automatically
import { asyncHandler } from "../utils/asyncHandler.js";

// Import the ApiError class to handle and throw custom API errors
import { ApiError } from "../utils/ApiError.js";

// Import the User model to interact with the user database collection
import { User } from "../models/user.model.js";

// Import the function to upload files to Cloudinary for storing images
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Import the ApiResponse utility to structure and format API responses
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAcessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Refresh and Acess token")

  }
}
// Define the registerUser function wrapped with asyncHandler
// asyncHandler automatically forwards errors to the middleware for handling
const registerUser = asyncHandler(async (req, res) => {
  // Step 1: Extract user details from the request body sent by the frontend
  const { fullName, email, username, password } = req.body;

  // Step 2: Log the email for debugging purposes
  // console.log("email: " + email);

  // Step 3: Check if any of the fields (fullName, email, username, password) are empty or invalid
  if (
    [fullName, email, password, username].some((field) =>
      field?.trim() === "")
  ) {
    // Throw an error if any field is missing
    throw new ApiError(400, 'All fields are required');
  }

  // Step 4: Check if a user already exists with the given email or username
  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  // Step 5: If the user already exists, throw a conflict error
  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }
  //  console.log(req.files)

  // Step 6: Extract file paths for avatar and cover image if they are included in the request
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;

  }

  // Step 7: Check if the avatar file is provided; throw an error if it's missing
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // Step 8: Upload the avatar to Cloudinary and get its URL
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // Step 9: Upload the cover image to Cloudinary if provided, or set it to an empty string
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Step 10: If the avatar upload fails, throw an error
  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // Step 11: Create a new user entry in the database with the provided and uploaded data
  const user = await User.create({
    fullName,
    avatar: avatar.url, // Save the URL of the uploaded avatar
    coverImage: coverImage?.url || "", // Save the cover image URL or set it to an empty string
    email,
    password,
    username: username.toLowerCase(), // Store the username in lowercase for consistency
  });

  // Step 12: Fetch the newly created user while excluding the password and refresh token fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Step 13: If the user creation fails, throw a server error
  if (!createdUser) {
    throw new ApiError(500, 'Failed to create user');
  }

  // Step 14: Return a success response with the created user details
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res,) => {
  // Steps
  // req body -> data
  //username or email to check
  // find the user
  // password check
  // access and refresh token generation
  // send cookie
  // res access granted else failed to login
  const { email, username, password } = req.body
  if (!username || !email) {
    throw new ApiError(400, 'Username or email is required');
  }
  const user = await User.findOne({
    $or: [{ email }, { username }]
  });
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }
  const { accessToken, refreshToken } = await generateAcessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refresh-token");
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,
        { user: loggedInUser, accessToken, refreshToken},
        "Logged in successfully"
      )
    )
});

const logoutUser = asyncHandler( async(req, res) => {
  
})

// Export the registerUser function so it can be imported and used in other files
// This is typically used in route definitions to handle the registration endpoint
export { registerUser };
