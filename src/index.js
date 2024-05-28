const serverless = require("serverless-http");
const express = require("express");

require("express-async-errors");

const { ZodError } = require("zod");
const { env } = require("./env");
const { challenges } = require("./infra/http/challenge");
const { solution } = require("./infra/http/solution");

const app = express();

app.use(express.json());

app.use(challenges);
app.use(solution);

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      error: err.errors,
    });
  }

  return res.status(500).json({
    error: err.message,
  });
});

if (env.PORT && env.NODE_ENV === "dev") {
  app.listen(env.PORT, () => {
    console.log(`Running on port ${env.PORT}`);
  });
}

module.exports.handler = serverless(app);
