const { readFile } = require("node:fs/promises");
const { EXTENSION } = require("./constants");

const getTemplateByLanguage = async ({ language }) => {
  const filePath = `./templates/${language.toLowerCase()}.${
    EXTENSION[language]
  }`;

  const file = await readFile(filePath);
  return file.toString();
};

module.exports.getTemplateByLanguage = getTemplateByLanguage;
