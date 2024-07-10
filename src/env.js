const { z } = require("zod");

const schema = z.object({
  DATABASE_URL: z
    .string({
      required_error: "Missing DATABASE_URL in environment variable",
    })
    .optional(),
  PORT: z.coerce
    .number({
      invalid_type_error: "PORT must be a number",
    })
    .default(5000),
  NODE_ENV: z
    .enum(["dev", "test", "prod"], {
      invalid_type_error:
        "NODE_ENV must one of the following: dev, test or prod",
      required_error: "Missing NODE_ENV in environment variables",
    })
    .default("dev"),
  CODERUNNER_FUNCTION: z.string().default("CodeRunnerFunction"),
  CODERUNNER_CONTAINER_URL: z.string().url().optional(),
  CLUSTER_URL: z.string().url().optional(),
  CLUSTER_SECRET_ID: z.string().optional(),
});

module.exports.env = schema.parse(process.env);
