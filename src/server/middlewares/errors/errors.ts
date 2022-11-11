import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../../CustomError/CustomError";

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "unknown endpoint" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message =
    error.publicMessage || "Oops, something went wrong, try again later";
  res.status(statusCode).json({ error: message });
};
