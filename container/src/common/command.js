const { spawn } = require("node:child_process");

const command = async (cmd, args) => {
  const cli = spawn(cmd, args);

  return new Promise((resolve) => {
    const stdout = [];
    const stderr = [];

    cli.stdout.on("data", (data) => {
      stdout.push(data);
    });

    cli.stderr.on("data", (data) => {
      stderr.push(data);
    });

    cli.stdout.on("close", () => {
      const err = Buffer.concat(stderr).toString("utf8");
      if (err.length > 0) {
        console.log(err);
      }

      resolve(Buffer.concat(stdout).toString("utf8"));
    });
  });
};

module.exports.command = command;
