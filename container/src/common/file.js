const { readFile } = require("node:fs/promises");
const { getFileContent } = require("../infra/services/s3");

const getCodeByChallengeId = async ({ challengeId, language }) => {
  const filePath = `/${challengeId}/${language}/challenge.${language}`;

  if (process.env.LOCAL) {
    const file = await readFile(`./samples${filePath}`);
    return file.toString();
  }

  return getFileContent({
    Bucket: process.env.CHALLENGE_BUCKET,
    Key: filePath,
  });
};

module.exports.getCodeByChallengeId = getCodeByChallengeId;
