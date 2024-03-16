const { randomUUID } = require("node:crypto");
const { writeFile } = require("node:fs/promises");
const { getTemplateByLanguage } = require("../common/file");
const { command } = require("../common/command");
const { LANGUAGE } = require("../common/constants");

const main = async ({ code, inputs }) => {
  const raw = await getTemplateByLanguage({
    language: LANGUAGE.PYTHON,
  });
  const challenge = raw.replace(/\#\s@code\-here/i, code);

  const runId = randomUUID();
  const filename = `/tmp/${runId}.py`;
  await writeFile(filename, challenge);

  const result = await command("python", [filename, JSON.stringify(inputs)]);

  return JSON.parse(result.replace(/\\n/, ""));
};

module.exports.main = main;
