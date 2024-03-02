const { randomUUID } = require("node:crypto");
const { writeFile } = require("node:fs/promises");
const { getCodeByChallengeId } = require("../common/file");
const { EXTENSIONS_PER_LANGUAGE } = require("../common/constants");

const main = async ({ code, challengeId }) => {
  const raw = await getCodeByChallengeId({
    challengeId,
    language: EXTENSIONS_PER_LANGUAGE.JS.toLowerCase(),
  });
  const challenge = raw.replace(/\/\/\s@code\-here/i, code);

  const runId = randomUUID();
  const filename = `/tmp/${runId}.js`;
  await writeFile(filename, challenge);

  const { main } = require(filename);
  return main();
};

module.exports.main = main;
