import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { mapSession } from "../lib/mappers.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const setSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string().min(1),
  setOrder: z.number().int().nonnegative(),
  weight: z.number(),
  reps: z.number().int().positive(),
  rir: z.number().int().min(0).max(10),
  isWarmup: z.boolean(),
});

const sessionBodySchema = z.object({
  splitId: z.string().optional(),
  splitName: z.string().min(1),
  date: z.string().datetime(),
  durationSeconds: z.number().int().nonnegative(),
  notes: z.string().optional(),
  sets: z.array(setSchema).min(1),
});

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req as AuthedRequest;
    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: { sets: { orderBy: { setOrder: "asc" } } },
      orderBy: { date: "desc" },
    });
    res.json(sessions.map(mapSession));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId } = req as AuthedRequest;
    const body = sessionBodySchema.parse(req.body);

    if (body.splitId) {
      const split = await prisma.splitTemplate.findFirst({
        where: { id: body.splitId, userId },
      });
      if (!split) {
        res.status(400).json({ error: "Rutina asociată este invalidă" });
        return;
      }
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId,
        splitId: body.splitId ?? null,
        splitName: body.splitName,
        date: new Date(body.date),
        durationSeconds: body.durationSeconds,
        notes: body.notes,
        sets: {
          create: body.sets.map((s) => ({
            exerciseId: s.exerciseId,
            setOrder: s.setOrder,
            weight: s.weight,
            reps: s.reps,
            rir: s.rir,
            isWarmup: s.isWarmup,
          })),
        },
      },
      include: { sets: { orderBy: { setOrder: "asc" } } },
    });

    res.status(201).json(mapSession(session));
  } catch (err) {
    next(err);
  }
});

export default router;
