const { execSync } = require("child_process");

module.exports.handler = () => {
  console.log(execSync("echo $(id -u):$(id -g)").toString());
  console.log(execSync("ls -la").toString());
  const output = execSync("./node_modules/.bin/prisma migrate deploy");
  console.log(output.toString());
};
