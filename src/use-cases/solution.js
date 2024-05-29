const { coderunner } = require("../infra/services/code-runner");

const run = async ({ inputs, code, language }) => {
  const results = await coderunner
    .run({
      inputs: inputs.map(({ id, value }) => ({ id, value })),
      language,
      code,
    })
    .then((results) => {
      return results.reduce((result, { id, input, output }) => {
        result[id] = { input, output };
        return result;
      }, {});
    });

  return inputs
    .reduce((acc, { id, expected }) => {
      const result = results[id];

      if (result) {
        acc.push({
          ...result,
          pass: result.output === expected,
          expected,
        });
      }

      return acc;
    }, [])
    .map((result, index) => {
      if (index >= 2) {
        delete result.expected;
      }

      return result;
    });
};

module.exports.challengeSolution = { run };
