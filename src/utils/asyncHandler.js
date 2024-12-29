// Promise method for async handler method
const asyncHandler = (requestHandler) => {
  // This wrapper function ensures that all promises in the request handler
  // are resolved, and any errors are automatically passed to the next middleware.
  return (req, res, next) => {
    // Resolve the promise returned by the handler and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler }; // Export the asyncHandler for use in other files

// Alternative definitions of asyncHandler for reference:
// const asyncHandler = ()=>{} 
// A placeholder version of the function with no implementation

// const asyncHandler = (func)=>() => {} 
// A version that takes a function and returns an empty function

// const asyncHandler = (func)=> async()=>{}
// A version that defines an asynchronous function but doesn't implement it

// Try-catch method to implement async handler method
// This alternative implementation uses a traditional try-catch block
// for error handling within an asynchronous request handler:

// const asyncHandler = (fn) => async(req, res, next) => {
//   try {
//     await fn(req, res, next); // Execute the passed-in handler function
//   } catch (error) {
//     res.status(error.code || 500).json({ // Handle errors gracefully
//       success: false,
//       message: error.message || "Server Error",
//     });
//   }
// };
