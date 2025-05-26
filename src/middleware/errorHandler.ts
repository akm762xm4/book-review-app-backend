import { Request, Response, NextFunction } from "express";
import createHttpError, { isHttpError } from "http-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let errorMessage = "An unknown Error Occurred!";
  let statusCode = 500;
  if (isHttpError(err)) {
    statusCode = err.status;
    errorMessage = err.message;
  }
  res.status(statusCode).json({ error: errorMessage });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Endpoint not Found !"));
};
