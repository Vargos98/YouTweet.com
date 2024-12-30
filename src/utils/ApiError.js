class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "" // Corrected parameter name
  ) {
    super(message); // Call the parent class (Error) constructor with the message
    this.statusCode = statusCode; // HTTP status code
    this.data = null; // Placeholder for additional data, if needed
    this.message = message; // Error message
    this.success = false; // Indicates the operation was not successful
    this.errors = errors; // Additional error details
    if (stack) {
      this.stack = stack; // Custom stack trace if provided
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
  }
}

export {ApiError} // Export the class for use in other files
