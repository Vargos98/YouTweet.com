// Import the asyncHandler utility function from the "../utils/asyncHandler.js" file
// This utility is used to handle asynchronous functions and manage errors automatically
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// Define the registerUser function using asyncHandler
// asyncHandler wraps the function to catch and forward any errors to the error-handling middleware
const registerUser = asyncHandler(async (req, res) => {
  //steps to register user
  // get user details from frontend
  //validataion =- not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object -create entery in db
  // remove password and refresh token field from response
  // check for user creation 
  //return res

  const { fullName, email, username, password } = req.body
  console.log("email: " + email);
  if (
    [fullName, email, password, username].some((field) =>
      field?.trim() === "")

  ) {

    throw new ApiError(400, 'All fields are required')
  }
  const existedUser = User.findOne({
    $or: [{ email }, { username }]
  })
  if (existedUser) {
    throw new ApiError(409, 'User already exists')
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required')
  }


  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  })
const createdUser=  await User.findById(user._id).select(
  "-password -refreshToken"
)
if (!createdUser) {
  throw new ApiError(500, 'Failed to create user')
  
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered successfully")
)

});

// Export the registerUser function so it can be imported and used in other files
// This is typically used in route definitions to handle the registration endpoint
export { registerUser };
