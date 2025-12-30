import express from  "express";

import AppError from "./Utils/AppError";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

import urlRoutes from "./Routes/urlRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', urlRoutes)

// HANDLING unhandled Routes
app.use((req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
