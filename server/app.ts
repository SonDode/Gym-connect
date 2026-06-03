import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import splitsRoutes from "./routes/splits.js";
import sessionsRoutes from "./routes/sessions.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "gym-connect-api" });
});

app.use("/api/splits", splitsRoutes);
app.use("/api/sessions", sessionsRoutes);

app.use(errorHandler);
