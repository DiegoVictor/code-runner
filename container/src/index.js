const { LANGUAGE } = require("./common/constants");
const { HTTP } = require("./common/response");
const { main: JAVASCRIPT } = require("./use-cases/run-js");

const runners = {
  JAVASCRIPT,
};

const handler = async (event) => {
  const language = event.body.language.toUpperCase();

  if (!Object.keys(LANGUAGE).includes(language)) {
    return HTTP.BAD_REQUEST({
      error: `The provided language not recognized or supported.`,
    });
  }

  const runner = runners[LANGUAGE[language]];
  const { challengeId, code } = event.body;

  const result = await runner({
    challengeId,
    code,
  });

  return HTTP.OK(result);
};

module.exports.handler = handler;
