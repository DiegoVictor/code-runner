const { Router } = require("express");
const { z } = require("zod");
const { challengeRepository } = require("../database/repositories/challenge");
const { challengeSolution } = require("../../use-cases/solution");
const { LANGUAGE } = require("../../common/language");

const app = Router();

app.post("/challenges/:id/solution", async (req, res) => {
  const { id, code, language } = z
    .object({
      id: z.string().uuid(),
      code: z.string().min(1),
      language: z
        .string()
        .toLowerCase()
        .pipe(z.enum(Object.values(LANGUAGE))),
    })
    .parse({ ...req.params, ...req.body });

  const challenge = await challengeRepository.findOneById(id);
  if (!challenge) {
    return res.status(404).json({
      error: "Not Found",
    });
  }

  const { inputs } = challenge;
  const results = await challengeSolution.run({ inputs, code, language });

  return res.status(200).json(results);
});

module.exports = {
  solution: app,
};
