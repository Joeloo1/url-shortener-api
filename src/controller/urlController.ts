import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

import Url from "../Model/URL.Model";
import catchAsync from "../Utils/catchAsync";
import AppError from "../Utils/AppError";

// Generate Short Code
const ShortCode = (): string => {
  return nanoid(6);
};

// Validate URL format 
const isValidUrl = (url: string) : boolean => {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(url);
}

//  Create Short Url
export const shorten = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return next(new AppError("OriginalUrl is required", 400));
    };
    
    if (!isValidUrl(originalUrl)) {
      return next(new AppError('Invalid URL format', 400));
    };

    // Check if URL already exists in the database 
    let url = await Url.findOne({ originalUrl});

    if (url) { 
      res.status(200).json({
        status: 'success',
        data: {
          orginalUrl: url.originalUrl,
          shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
          shortCode: url.shortCode
        }
      });
      return;
    }

    // Create a unique Short Code 
    let shortCode = ShortCode();

    // Create new URL entry 
    url = await Url.create({
      originalUrl,
      shortCode
    });

    res.status(201).json({
      status: 'success',
      data: {
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode
      }
    })
   }
);
