const { transpile } = require("typescript");

const compile = (code) =>
  transpile(code, {
    lib: ["ES2023"],
    module: "node16",
    target: "ES2022",
  });

module.exports.compile = compile;
