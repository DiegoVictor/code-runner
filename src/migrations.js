const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const { spawnSync } = require("child_process");

module.exports.handler = async () => {
  // const secretsManager = new SecretsManager({});
  // const secret = await secretsManager.getSecretValue({
  //   SecretId: process.env.DB_SECRET,
  // });
  // const { username, password } = JSON.parse(secret.SecretString);

  // const DATABASE_URL = `postgresql://${username}:${password}@${process.env.DB_HOST}/coderunner?schema=public`;


  const { output, error } = spawnSync(
    "./node_modules/.bin/prisma migrate deploy",
    {
      shell: true,
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    }
  );

  if (error) {
    console.log(error.message, error.stack);
  }
  console.log(output.toString());
};
