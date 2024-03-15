const { LANGUAGE } = require("./common/constants");
const { HTTP } = require("./common/response");
const { compile } = require("./helpers/typescript");
const { main: JAVASCRIPT } = require("./use-cases/run-js");

const TYPESCRIPT = ({ code, inputs }) =>
  JAVASCRIPT({ code: compile(code), inputs });

const runners = {
  JAVASCRIPT,
  TYPESCRIPT,
};

const handler = async (event) => {
  const language = event.body.language.toUpperCase();

  if (!Object.keys(LANGUAGE).includes(language)) {
    return HTTP.BAD_REQUEST({
      error: `The provided language not recognized or supported.`,
    });
  }

  const runner = runners[LANGUAGE[language]];
  const { code, inputs } = event.body;

  const result = await runner({
    inputs,
    code,
  });

  return HTTP.OK(result);
};

module.exports.handler = handler;
