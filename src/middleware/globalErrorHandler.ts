import { Request, Response, NextFunction } from "express";
import AppError from "../Utils/AppError";

interface CustomError extends Error {
    statusCode?: number; 
    status?: string;
    code?: number;
    name: string;
    isOperational?: boolean;
    errors?: Record<string, { message: string}>;

}


// Handle CastError  
const handleCastErrorDB = ( err: CustomError) => {
    const message = `Invalid ${err.name}: ${err.message}`;
    return new AppError(message, 400);
}

// Handle Duplicate Fields Error
const handleDuplicateFieldsDB = (err: CustomError) => {
  const match = err.message.match(/(["'])(\\?.)*?\1/);
  const value = match?.[0] ?? "unknown";

  const message = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(message, 400);
};


// Handle Validation Error
const handleValidationErrorDB = ( err: CustomError) => {
  const errors = Object.values(err.errors ?? {}).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}
// Send Error in Development Environment 
const sendErrorDev = ( err: CustomError, res: Response) => {
    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
        error: err,
        stack: err.stack
    });
}

// Send Error in production Environment 
const sendErrorProd = ( err: CustomError, res: Response) => {
    // Operational, trusted error: send message to client 
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({
            status: err.status || "error",
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: " Something went very wrong!"
        });
    };
};

// Global Error Handling Middleware 
export const globalErrorHandler = ( err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);          
        error.message = err.message;
        error.name = err.name;

        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    }
};