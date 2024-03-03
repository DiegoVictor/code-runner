const { randomUUID } = require("node:crypto");
const { writeFile } = require("node:fs/promises");
const { getTemplateByLanguage } = require("../common/file");
const { LANGUAGE } = require("../common/constants");

const main = async ({ code, challengeId }) => {
  const raw = await getTemplateByLanguage({
    language: LANGUAGE.JS,
  });
  const content = raw.replace(/\/\/\s@code\-here/gi, code);

  const runId = randomUUID();
  const filename = `/tmp/${runId}.js`;
  await writeFile(filename, content);

  const { main } = require(filename);
  return main();
};

module.exports.main = main;
