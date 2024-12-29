import mongoose, { Schema } from "mongoose"; 
// Import mongoose and Schema class to define the data structure for the MongoDB collection

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 
// Import the mongoose plugin to add pagination functionality for aggregation queries

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true, // Mandatory field
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true, // Mandatory field
    },
    title: {
      type: String, // Title of the video
      required: true, // Mandatory field
    },
    description: {
      type: String, // Description of the video
      required: true, // Mandatory field
    },
    duration: {
      type: Number, // Duration of the video in seconds
      required: true, // Mandatory field
    },
    views: {
      type: Number, // Number of views the video has received
      default: 0, // Default value is 0
    },
    isPublished: {
      type: Boolean, // Boolean to indicate whether the video is published
      default: true, // Default value is true
    },
    owner: {
      type: Schema.Types.ObjectId, // Reference to the User collection
      ref: 'User', // Specifies the referenced model
      required: true, // Mandatory field
    },
  },
  { timestamps: true } 
  // Adds `createdAt` and `updatedAt` fields to the schema automatically
);

// Add the mongooseAggregatePaginate plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate); 

// Export the Video model based on the schema
export const Video = mongoose.model('Video', videoSchema); 
