const { Lambda } = require("@aws-sdk/client-lambda");
const { env } = require("../../env");

const run = async ({ language, code, inputs }) => {
  if (env.NODE_ENV === "dev" && env.CODERUNNER_CONTAINER_URL) {
    return fetch(env.CODERUNNER_CONTAINER_URL, {
      method: "POST",
      body: JSON.stringify({
        language,
        code,
        inputs,
      }),
    }).then(async (response) => {
      const { statusCode, body, error } = await response.json();
      if (statusCode === 200) {
        return JSON.parse(body);
      }

      throw new Error(error);
    });
  }

  const client = new Lambda();
  const { Payload } = await client.invoke({
    FunctionName: env.CODERUNNER_FUNCTION,
    Payload: JSON.stringify({
      language,
      code,
      inputs,
    }),
  });
  const { body } = JSON.parse(Buffer.from(Payload).toString("utf-8"));

  return JSON.parse(body);
};

module.exports = {
  coderunner: {
    run,
  },
};
