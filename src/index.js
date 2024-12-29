// require('dotenv').config(); this was the old way of importing dotenv file
// new way 
import dotenv from 'dotenv';
import connectDB from './db/index.js';
// import mongoose from 'mongoose';
// import {DB_NAME} from 'constants';

// Professional approach to connect to MongoDB.
// Load environment variables
dotenv.config({
  path: "./.env", // Ensure the correct path to your .env file
});

// Connect to the database
connectDB();

// Add more logic here if needed for your server (e.g., starting Express)















// THIS IS THE BASIC APPROACH TO CONNECT DB TO THE PROJECT
// Over here we have used Async await to make sure we have proper error handling for the function
// This is used when we are using basic methodlogies.


// import express from 'express';
// const app  = express();
//  ;(async()=>{
//     try {
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//       app.on("error",()=>{
//         console.log("Error: " ,error);
//         throw error;
//       })
//       app.listen(process.env.PORT,()=>{
//         console.log(`Server is running on port ${process.env.PORT}`);
//       })
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//  })()