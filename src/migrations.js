const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const { execSync } = require("child_process");
const { getURL } = require("./common/database");

module.exports.handler = async () => {
  const secretsManager = new SecretsManager({});
  const secret = await secretsManager.getSecretValue({
    SecretId: process.env.CLUSTER_SECRET_ID,
  });
  const { username, password } = JSON.parse(secret.SecretString);

  const DATABASE_URL = getURL(username, password);
  const output = execSync(
    `DATABASE_URL=${DATABASE_URL} ./node_modules/.bin/prisma migrate deploy`
  );

  console.log(output.toString());
};
