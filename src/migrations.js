const { execSync } = require("child_process");
const { manager } = require("./infra/database/manager");

module.exports.handler = async () => {
  const DATABASE_URL = await manager.getURL();
  const output = execSync(
    `DATABASE_URL=${DATABASE_URL} ./node_modules/.bin/prisma migrate deploy`
  );

  console.log(output.toString());
};
