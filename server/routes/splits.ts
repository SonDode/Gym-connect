import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { mapSplit } from "../lib/mappers.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const splitExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  targetSets: z.number().int().positive(),
  targetRepRange: z.string().min(1),
  order: z.number().int().nonnegative(),
});

const splitBodySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  description: z.string().optional().default(""),
  exercises: z.array(splitExerciseSchema),
});

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req as unknown as AuthedRequest;
    const splits = await prisma.splitTemplate.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    res.json(splits.map(mapSplit));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { userId } = req as unknown as AuthedRequest;
    const body = splitBodySchema.parse(req.body);

    const split = await prisma.splitTemplate.create({
      data: {
        userId,
        name: body.name,
        description: body.description,
        exercises: body.exercises,
      },
    });

    res.status(201).json(mapSplit(split));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { userId } = req as unknown as AuthedRequest;
    const body = splitBodySchema.parse(req.body);

    const existing = await prisma.splitTemplate.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Rutina nu a fost găsită" });
      return;
    }

    const split = await prisma.splitTemplate.update({
      where: { id: existing.id },
      data: {
        name: body.name,
        description: body.description,
        exercises: body.exercises,
      },
    });

    res.json(mapSplit(split));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { userId } = req as unknown as AuthedRequest;
    const existing = await prisma.splitTemplate.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!existing) {
      res.status(404).json({ error: "Rutina nu a fost găsită" });
      return;
    }

    await prisma.splitTemplate.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
