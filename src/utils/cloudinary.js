// Import the Cloudinary library (v2) for managing media files in the cloud
import { v2 as cloudinary } from "cloudinary";
// Import the `fs` module for interacting with the filesystem
import fs from "fs";

// Configuration for Cloudinary
cloudinary.config({
  // Cloudinary cloud name from environment variables
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // Cloudinary API key from environment variables
  api_key: process.env.CLOUDINARY_API_KEY,
  // Cloudinary API secret from environment variables
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // If no file path is provided, return null
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });

    // File has been successfully uploaded, log the URL
    // console.log("File uploaded successfully on cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    // Return the response from Cloudinary
    return response;
  } catch (error) {
    // If an error occurs, delete the temporary file from the local system
    fs.unlinkSync(localFilePath); 
    console.error("File upload failed:", error); // Log the error for debugging
    return null; // Return null indicating failure
  }
};

// Example usage of Cloudinary uploader (commented out)
/*
cloudinary.v2.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
  { public_id: "shoes" }, // Specify a public ID for the file
  function (error, result) { 
    console.log(result); // Log the result of the upload
  }
);
*/

// Export the upload function for use in other modules
export { uploadOnCloudinary };
