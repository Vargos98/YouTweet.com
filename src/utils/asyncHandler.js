// Promise method for async handler method
const asyncHandler = (requestHandler)=>{

  (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
  }
} 

export {asyncHandler} 




// const asyncHandler = ()=>{} 
// const asyncHandler = (func)=>() => {} 
// const asyncHandler = (func)=> async()=>{}

// try catch method to implement async handler method  




// const asyncHandler = (fn) => async(req,resizeBy,next)=>{
//   try {
//     await fn(req,res,next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       sucess:false,
//       message: error.message || "Server Error",
//     })
//   }
// }