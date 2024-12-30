// Importing the Multer library to handle file uploads
import multer from "multer";

// Configuring the storage settings for file uploads
const storage = multer.diskStorage({
  // Defining the destination folder for uploaded files
  destination: function(req, file, cb) {
    // Passing 'null' as the error (no error) and the upload folder path
    cb(null, "./public/temp");
  },
  // Defining the filename for the uploaded file in the destination folder
  filename: function(req, file, cb) {
    // Passing 'null' as the error (no error) and setting the file's original name
    cb(null, file.originalname);
  }
});

// Creating an instance of Multer with the specified storage configuration
export const upload = multer({
  storage, // Linking the custom storage settings to Multer
});
