const { execSync } = require("child_process");
const { secretManager } = require("./infra/services/secret-manager");

module.exports.handler = async () => {
  const { username, password } = await secretManager.getSecret(
    process.env.CLUSTER_SECRET_ID
  );
  const pass = encodeURIComponent(password);
  const DATABASE_URL = `postgresql://${username}:${pass}@${process.env.CLUSTER_URL}/coderunner?schema=public`;

  const output = execSync(
    `DATABASE_URL="${DATABASE_URL}" ./node_modules/.bin/prisma migrate deploy`
  );

  console.log(output.toString());
};
