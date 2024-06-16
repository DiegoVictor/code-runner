const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const { spawnSync } = require("child_process");

module.exports.handler = async () => {
  const secretsManager = new SecretsManager({});
  const secret = await secretsManager.getSecretValue({
    SecretId: process.env.CLUSTER_SECRET_ID,
  });
  const { username, password } = JSON.parse(secret.SecretString);
  console.log({ username, password });

  // const DATABASE_URL = `postgresql://${username}:${password}@${process.env.DB_HOST}/coderunner?schema=public`;
  // postgresql://app_user:P`ynjD)-[vYa!R1_2P3)D!QR1Z=t,H@coderunner-dbcluster.cluster-cqcxtxjpaiia.us-east-1.rds.amazonaws.com:5432/coderunner?schema=public

  const { output, error } = spawnSync(
    "./node_modules/.bin/prisma migrate deploy",
    {
      shell: true,
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
    }
  );

  if (error) {
    console.log(error.message, error.stack);
  }
  console.log(output.toString());
};
