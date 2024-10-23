const { spawn } = require("node:child_process");

const command = async (cmd, args) => {
  const cli = spawn(cmd, args);

  return new Promise((resolve) => {
    const chunks = [];

    cli.stdout.on("data", (data) => {
      chunks.push(data);
    });

    cli.stderr.on("data", (data) => {
      chunks.push(data);
    });

    cli.stdout.on("close", () => {
      const response = Buffer.concat(chunks).toString("utf8");
      resolve(response);
    });
  });
};

module.exports.command = command;
