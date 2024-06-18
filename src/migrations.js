const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const { spawnSync } = require("child_process");

module.exports.handler = async () => {
  const secretsManager = new SecretsManager({});
  const secret = await secretsManager.getSecretValue({
    SecretId: process.env.CLUSTER_SECRET_ID,
  });
  const { username, password } = JSON.parse(secret.SecretString);

  const DATABASE_URL = `postgresql://${username}:${password}@${process.env.CLUSTER_URL}/coderunner?schema=public`;
  const { output, error } = spawnSync(
    "./node_modules/.bin/prisma migrate deploy",
    {
      shell: true,
      env: {
        DATABASE_URL,
      },
    }
  );

  if (error) {
    console.log(error.message, error.stack);
  }
  console.log(output.toString());
};
