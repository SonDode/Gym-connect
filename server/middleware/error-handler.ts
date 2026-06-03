import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (res.headersSent) return;

  if (err instanceof ZodError) {
    res.status(400).json({ error: err.errors[0]?.message ?? "Date invalide" });
    return;
  }

  const message = err instanceof Error ? err.message : "Eroare internă";
  const status =
    message.includes("există deja") || message.includes("invalid") ? 400 : 500;

  res.status(status).json({ error: message });
}
