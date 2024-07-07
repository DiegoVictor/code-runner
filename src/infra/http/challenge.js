const { Router } = require("express");
const { z } = require("zod");
const { challengeRepository } = require("../database/repositories/challenge");
const { languageRepository } = require("../database/repositories/language");
const { LANGUAGE } = require("../../application/language");

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

  const { title, description, instructions, languages, createdAt, updatedAt } =
    challenge;
  return res.status(200).json({
    id,
    title,
    description,
    instructions,
    languages: languages.map((language) => ({
      name: language.name,
      code: language.code,
      template: language.template,
    })),
    createdAt,
    updatedAt,
  });
});

app.post("/challenges", async (req, res) => {
  const {
    title,
    description,
    instructions,
    inputs,
    languages: code,
  } = z
    .object({
      title: z.string().min(3),
      description: z.string().min(10),
      instructions: z.string().min(1),
      languages: z.array(z.enum(Object.values(LANGUAGE))),
      inputs: z
        .array(
          z
            .object({
              id: z.string().cuid(),
              value: z.any(),
              expected: z.any(),
            })
            .refine(
              (data) => {
                return data.value && data.expected;
              },
              { message: "value and expected properties are required" }
            )
        )
        .min(1),
    })
    .parse(req.body);

  const languages = await languageRepository.findBy({ code });
  await challengeRepository.save({
    title,
    description,
    instructions,
    inputs,
    languages,
  });

  return res.sendStatus(201);
});

module.exports.challenges = app;
