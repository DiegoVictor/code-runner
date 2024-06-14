const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
// const { command } = require("./common/command");
const { execSync } = require("child_process");

module.exports.handler = async () => {
  // const secretsManager = new SecretsManager({});
  // const secret = await secretsManager.getSecretValue({
  //   SecretId: process.env.DB_SECRET,
  // });
  // const { username, password } = JSON.parse(secret.SecretString);

  // const DATABASE_URL = `postgresql://${username}:${password}@${process.env.DB_HOST}/coderunner?schema=public`;

  const output = execSync("./node_modules/.bin/prisma migrate deploy");
  console.log(output.toString());
};
