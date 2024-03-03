const { readFile } = require("node:fs/promises");
const { EXTENSIONS_PER_LANGUAGE } = require("./constants");

const getTemplateByLanguage = async ({ language }) => {
  const filePath = `./templates/${language.toLowerCase()}.${
    EXTENSIONS_PER_LANGUAGE[language]
  }`;

  const file = await readFile(filePath);
  return file.toString();
};

module.exports.getTemplateByLanguage = getTemplateByLanguage;
