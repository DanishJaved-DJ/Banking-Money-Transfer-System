import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const response = new ApiResponse(
    statusCode,
    err.message || "Internal Server Error",
    err.data || null,
  );

  res.status(statusCode).json(response);
};

export default errorHandler;
