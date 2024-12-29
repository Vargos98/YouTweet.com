import mongoose from 'mongoose';
import {DB_NAME} from 'constants';


















// THIS IS THE BASIC APPROACH TO CONNECT DB TO THE PROJECT


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