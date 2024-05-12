const { LANGUAGE } = require("./common/constants");
const { HTTP } = require("./common/response");
const { compile } = require("./helpers/typescript");
const { main: GO } = require("./use-cases/run-go");
const { main: JAVASCRIPT } = require("./use-cases/run-js");
const { main: PYTHON } = require("./use-cases/run-python");

const TYPESCRIPT = ({ code, inputs }) =>
  JAVASCRIPT({ code: compile(code), inputs });

const runners = {
  JAVASCRIPT,
  TYPESCRIPT,
  PYTHON,
  GO,
};

const handler = async (event) => {
  const language = event.language.toUpperCase();

  if (!Object.keys(LANGUAGE).includes(language)) {
    return HTTP.BAD_REQUEST({
      error: `The provided language not recognized or supported.`,
    });
  }

  const runner = runners[LANGUAGE[language]];
  const { code, inputs } = event;

  const result = await runner({
    inputs,
    code,
  });

  return HTTP.OK(result);
};

module.exports.handler = handler;
