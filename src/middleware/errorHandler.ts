import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal error";
  res.status(status).json({ error: message });
};
