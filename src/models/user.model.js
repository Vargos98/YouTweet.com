import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define a schema for the User model
const userSchema = new Schema(
  {
    // Define a username field with constraints
    username: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate usernames
      lowercase: true, // Converts value to lowercase
      trim: true, // Removes extra whitespace
      index: true, // Adds an index for faster queries
    },
    // Define an email field with constraints
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      lowercase: true,
      trim: true,
    },
    // Define a fullName field
    fullName: {
      type: String,
      required: true,
      trim: true, // Removes extra whitespace
      index: true,
    },
    // Define an avatar field for storing profile picture URL
    avatar: {
      type: String, // Typically stores a URL from a cloud storage service
      required: true,
    },
    // Optional coverImage field
    coverImage: {
      type: String, // Typically stores a URL for the cover image
    },
    // Define a watchHistory field to store related Video document IDs
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // References the Video model
        ref: "Video",
      },
    ],
    // Define a password field
    password: {
      type: String,
      required: [true, 'Password is required'], // Custom error message if missing
    },
    // Define a refreshToken field for token-based authentication
    refreshToken: {
      type: String, // Stores a JWT refresh token
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next(); // Skip if the password is not modified
  {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
    next(); // Continue to the next middleware or save
  }
});

// Method to compare the input password with the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // Returns true if passwords match
};

// Method to generate a JWT access token for the user
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Include user's ID in the payload
      email: this.email, // Include user's email in the payload
      username: this.username, // Include username
      fullName: this.fullName, // Include full name
    },
    process.env.ACCESS_TOKEN_SECRET, // Secret key for signing
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Token expiry duration
  );
};

// Method to generate a JWT refresh token for the user
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Include only the user's ID in the payload
    },
    process.env.REFRESH_TOKEN_SECRET, // Secret key for signing
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Token expiry duration
  );
};

// Export the User model based on the schema
export const User = mongoose.model("User", userSchema);
