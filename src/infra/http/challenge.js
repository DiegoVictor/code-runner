const { Router } = require("express");
const { z } = require("zod");
const { challengeRepository } = require("../database/repositories/challenge");

const app = Router();

app.get(["/", "/challenges"], async (req, res) => {
  const { limit, cursorId } = z
    .object({
      limit: z.coerce.number().positive().default(10),
      cursorId: z.string().optional(),
    })
    .parse(req.query);

  const challenges = await challengeRepository.find({
    take: limit,
    cursor: cursorId,
  });
  res.header("X-Total-Count", challenges.total);

  return res.status(200).json(challenges);
});

app.get("/challenges/:id", async (req, res) => {
  const { id } = z
    .object({
      id: z.string().uuid(),
    })
    .parse(req.params);

  const challenge = await challengeRepository.findOneById(id);
  if (!challenge) {
    return res.status(404).json({
      message: "Not Found",
    });
  }

  const { title, description, instructions, createdAt, updatedAt } = challenge;
  return res.status(200).json({
    id,
    title,
    description,
    instructions,
    createdAt,
    updatedAt,
  });
});

module.exports.challenges = app;
