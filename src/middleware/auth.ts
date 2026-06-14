import { NextFunction, Request, Response } from "express";
import { config } from "../../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }
  if (token !== config.authToken) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
