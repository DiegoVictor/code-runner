const { randomUUID } = require("node:crypto");
const { writeFile } = require("node:fs/promises");
const { getCodeByChallengeId } = require("../common/file");
const { LANGUAGE } = require("../common/constants");

const main = async ({ code, challengeId }) => {
  const raw = await getCodeByChallengeId({
    challengeId,
    language: LANGUAGE.JS,
  });
  const challenge = raw.replace(/\/\/\s@code\-here/i, code);

  const runId = randomUUID();
  const filename = `/tmp/${runId}.js`;
  await writeFile(filename, challenge);

  const { main } = require(filename);
  return main();
};

module.exports.main = main;
