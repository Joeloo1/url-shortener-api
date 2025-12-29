import express from  "express";

import AppError from "./Utils/AppError";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HANDLING unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
