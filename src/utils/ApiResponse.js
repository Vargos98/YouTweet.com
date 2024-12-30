// A class to standardize API responses
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code (e.g., 200, 404)
    this.data = data; // The response payload (e.g., objects, arrays, etc.)
    this.message = message; // Optional message (default: "Success")
    this.success = statusCode < 400; // Boolean indicating if the request was successful
  }
}

export {ApiResponse}; // Exporting the class for use in other modules
