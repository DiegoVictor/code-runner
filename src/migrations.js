const { execSync } = require("child_process");

module.exports.handler = () => {
  const output = execSync("./node_modules/.bin/prisma migrate deploy");
  console.log(output.toString());
};
