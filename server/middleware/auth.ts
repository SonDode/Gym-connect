import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export type AuthedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Autentificare necesară" });
    return;
  }
  (req as AuthedRequest).userId = userId;
  next();
}
