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

};

module.exports = {
  coderunner: {
    run,
  },
};
